const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
(async()=>{
  const root=path.resolve(__dirname,'../..');
  let legacy=true;
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(!url.pathname.startsWith('/monomikke/'))return res.writeHead(404).end();
    const name=url.pathname.slice('/monomikke/'.length)||'index.html';
    if(legacy && name==='service-worker.js'){
      res.setHeader('Content-Type','application/javascript');
      return res.end(`self.addEventListener('install',e=>e.waitUntil(caches.open('monomikke-post-studio-v1').then(c=>c.put('./index.html',new Response('OLD SCREEN'))).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));`);
    }
    const file=path.resolve(root,name);
    if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
    fs.readFile(file,(err,data)=>{
      if(err)return res.writeHead(404).end();
      res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.woff2')?'font/woff2':'text/html');
      res.setHeader('Cache-Control','no-cache');res.end(data);
    });
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
    const context=await browser.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const base=`http://127.0.0.1:${server.address().port}/monomikke/`;
    await page.goto(base);
    // Production registers only on HTTPS; explicitly register for localhost testing.
    await page.evaluate(async()=>{
      await navigator.serviceWorker.register('./service-worker.js');await navigator.serviceWorker.ready;
      await caches.open('unrelated-app');localStorage.setItem('preserve-test','existing data');
    });
    await page.waitForFunction(()=>navigator.serviceWorker.controller);
    legacy=false;
    await page.evaluate(async()=>{const registration=await navigator.serviceWorker.getRegistration();await registration.update();});
    await page.waitForFunction(async()=>!(await caches.keys()).includes('monomikke-post-studio-v1'));
    await page.reload();
    await page.locator('#easy-name').fill('保存する商品');
    await page.locator('#easy-url').fill('https://hb.afl.rakuten.co.jp/hgc/test/');
    await page.locator('#easy-form button[type=submit]').click();
    await page.waitForFunction(()=>!document.getElementById('easy-ready').hidden);
    const before=await page.evaluate(()=>({...localStorage}));
    await context.setOffline(true);await page.reload();
    await page.waitForFunction(()=>typeof MonomikkeEasy==='object' && typeof MonomikkeData==='object');
    assert.equal(await page.locator('#easy-flow').getAttribute('open'),'');
    assert.equal(await page.locator('#easy-existing option').count(),2);
    assert.deepEqual(await page.evaluate(()=>({...localStorage})),before);
    assert.ok((await page.evaluate(()=>caches.keys())).includes('unrelated-app'));
    assert.deepEqual(errors,[]);
    console.log('PASS: v1 upgrade at /monomikke/, offline easy scripts and brand dependencies, existing posts/products/localStorage and unrelated cache preserved');
  }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
