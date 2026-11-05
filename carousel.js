(function(root){
const Product=root.MonomikkeProduct||(typeof module!=='undefined'?require('./product.js'):null);
const themes={cream:{name:'クリーム',bg:'#faf4e5',paper:'#fffdf7',accent:'#9a7647',ink:'#453c30'},pink:{name:'くすみピンク',bg:'#f1e0e2',paper:'#fff9f9',accent:'#a36878',ink:'#503d45'},sage:{name:'セージグリーン',bg:'#e3ebe0',paper:'#fafcf7',accent:'#688568',ink:'#344d3d'},magazine:{name:'大人かわいい・雑誌風',bg:'#e7ede4',paper:'#fcfaf4',accent:'#637e69',ink:'#34483c'}};
const segments=s=>typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter('ja',{granularity:'grapheme'}).segment(s),x=>x.segment):Array.from(s);
function fromPost(theme,text){
 const blocks=text.trim().split(/\n\s*\n/).filter(Boolean);const intro=blocks.shift()||'';
 const summary=blocks.filter(x=>/^(?:⚠️|注意点|注意：|📌|ほかの発見|商品情報|#)/u.test(x.trim()));
 const explanation=blocks.filter(x=>!summary.includes(x));
 if(summary.length&&explanation.length)return [{title:theme,body:intro},{title:'ポイントをチェック',body:explanation.join('\n\n')},{title:'まとめ・確認メモ',body:summary.join('\n\n')}];
 const remaining=blocks.join('\n\n');const chars=segments(remaining);let split=Math.floor(chars.length/2);let best=-1,dist=Infinity;
 for(let i=0;i<chars.length;i++)if(chars[i]==='\n'&&Math.abs(i-split)<dist){best=i;dist=Math.abs(i-split);}
 if(best>=0)split=best;
 return [{title:theme,body:intro},{title:'ポイントをチェック',body:chars.slice(0,split).join('').trim()},{title:'まとめ・確認メモ',body:chars.slice(split).join('').trim()}];
}
function wrap(ctx,text,width){
 const lines=[];const closing=/^[、。，．！？!?）」』】〉》ー々ぁぃぅぇぉゃゅょっァィゥェォャュョッ]/u;const opening=/[（「『【〈《]$/u;
 for(const paragraph of text.split('\n')){let line='';for(const char of segments(paragraph)){if(line&&ctx.measureText(line+char).width>width){let next=char;while(line&&(opening.test(line)||closing.test(next))){const chars=segments(line);next=chars.pop()+next;line=chars.join('');if(!closing.test(next)&&!opening.test(line))break;}if(line)lines.push(line);line=next;}else line+=char;}lines.push(line);}
 return lines;
}
function fit(ctx,text,width,height,max,min){for(let size=max;size>=min;size--){ctx.font=`600 ${size}px sans-serif`;const lines=wrap(ctx,text,width);if(lines.every(x=>ctx.measureText(x).width<=width+.1)&&lines.length*size*1.55<=height)return {size,lines};}return null;}
function alignedX(x,width,textWidth,align='left'){const spare=Math.max(0,width-textWidth);return x+(align==='center'?spare/2:align==='right'?spare:0);}
function render(canvas,slide,index,design='cream',logo=null,options={}){
 if(design==='magazine')return renderMagazine(canvas,slide,index,logo,options);
 const t={...(themes[design]||themes.cream)};if(/^#[0-9a-f]{6}$/i.test(options.bg||'')){t.bg=options.bg;t.paper=options.bg;}if(/^#[0-9a-f]{6}$/i.test(options.ink||''))t.ink=options.ink;canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.fillStyle=t.bg;ctx.fillRect(0,0,1080,1350);ctx.fillStyle=t.paper;ctx.fillRect(48,48,984,1254);
 ctx.fillStyle=t.accent;if(design==='pink'){ctx.beginPath();ctx.arc(990,65,34,0,Math.PI*2);ctx.fill();}else if(design==='sage'){ctx.fillRect(48,48,22,1254);}else{ctx.fillRect(90,185,100,7);}
 ctx.font='600 28px sans-serif';ctx.fillText(['COVER','GUIDE','CHECK & SAVE'][index],96,155);
 const photo=options.photo;if(photo&&options.provided){ctx.fillStyle=t.ink;ctx.font='600 23px sans-serif';ctx.fillText('楽天市場の商品',96,405);}const font=Math.max(24,Math.min(60,Number(options.font)||46));
 const title=fit(ctx,slide.title,888,photo&&options.provided?150:photo?180:250,photo?52:index===0?76:60,28);const body=fit(ctx,slide.body,888,photo?300:570,font,24);
 function draw(layout,y,color,align='left'){if(!layout)return;ctx.fillStyle=color;ctx.font=`600 ${layout.size}px sans-serif`;for(const line of layout.lines){ctx.fillText(line,alignedX(96,888,ctx.measureText(line).width,align),y);y+=layout.size*1.55;}}
 draw(title,photo?240:300,t.ink,slide.titleAlign);if(photo){const box={x:96,y:430,w:888,h:400};ctx.save();ctx.beginPath();ctx.rect(box.x,box.y,box.w,box.h);ctx.clip();const rect=Product.crop(photo,box,options.provided?1:options.zoom,options.provided?0:options.x,options.provided?0:options.y,options.provided?'contain':options.mode);ctx.filter='none';ctx.drawImage(photo,rect.x,rect.y,rect.w,rect.h);ctx.restore();}draw(body,photo?900:590,t.ink,slide.bodyAlign);ctx.fillStyle=t.accent;ctx.fillRect(96,1200,888,2);ctx.font='600 30px sans-serif';ctx.fillText('モノみっけ！',logo?180:96,1260);ctx.font='24px sans-serif';ctx.fillText(`${index+1} / 3`,910,1260);
 if(logo){const ratio=Math.min(64/logo.width,64/logo.height);ctx.drawImage(logo,96,1215,logo.width*ratio,logo.height*ratio);}
 if(!title||!body)return {ok:false,error:`${index+1}枚目の文字量が多すぎます。文章を短くするか改行を減らしてください。内容は省略していません。`};
 return {ok:true,title,body};
}
// Preserve all supplied text. Missing attractions remain explicitly unfilled.
function pointCards(text){const paragraphs=text.split(/\n\s*\n/).filter(s=>s.trim());let parts=paragraphs.length>1?paragraphs:text.split('\n').filter(s=>s.trim());if(!parts.length)parts=[''];return [parts[0]||'',parts[1]||'',parts.slice(2).join('\n\n')];}
function renderMagazine(canvas,slide,index,logo,options){
 const t={...themes.magazine};if(/^#[0-9a-f]{6}$/i.test(options.bg||''))t.bg=options.bg;if(/^#[0-9a-f]{6}$/i.test(options.ink||''))t.ink=options.ink;
 canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');let valid=true;
 function box(x,y,w,h,color,r=20){ctx.fillStyle=color;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill();}
 function label(text,x,y,size=24,color=t.accent){ctx.fillStyle=color;ctx.font=`600 ${size}px sans-serif`;ctx.fillText(text,x,y);}
 function text(value,x,y,width,height,max,min=24,align='left'){const layout=fit(ctx,value,width,height,max,min);if(!layout){valid=false;return;}ctx.fillStyle=t.ink;ctx.font=`600 ${layout.size}px sans-serif`;layout.lines.forEach((line,i)=>ctx.fillText(line,alignedX(x,width,ctx.measureText(line).width,align),y+i*layout.size*1.55));}
 function photo(rect){if(!options.photo)return;box(rect.x-16,rect.y-16,rect.w+32,rect.h+32,'#ffffff',0);ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();const p=Product.crop(options.photo,rect,options.provided?1:options.zoom,options.provided?0:options.x,options.provided?0:options.y,options.provided?'contain':options.mode);ctx.filter='none';ctx.drawImage(options.photo,p.x,p.y,p.w,p.h);ctx.restore();if(options.provided)label('楽天市場の商品',rect.x,rect.y-30,21);}
 ctx.fillStyle=t.bg;ctx.fillRect(0,0,1080,1350);box(40,40,1000,1270,t.paper,12);box(72,70,205,38,'#e6cfcf',19);label('LITTLE FINDS',93,97,19);label(['暮らしに、ちょっといい発見。','好きになる理由を、ひとつずつ。','買う前のひと呼吸。'][index],80,150,23);label(`0${index+1}`,920,145,45);
 ctx.fillStyle='#d3dfd0';ctx.fillRect(80,175,920,2);
 const max=Math.max(24,Math.min(60,Number(options.font)||42));const hasPhoto=!!options.photo;
 text(slide.title,80,hasPhoto&&index>0?235:255,920,hasPhoto&&index>0?110:175,index===0?78:66,28,slide.titleAlign);
 if(index===0){if(hasPhoto)photo({x:96,y:480,w:888,h:400});else{box(96,465,888,400,'#edf1e8');label('小さな発見を、あなたの毎日へ。',150,680,35);}
 box(80,930,920,275,'#f0e5de');label('TODAY’S PICK',110,968,19);text(slide.body,110,1020,860,180,max,24,slide.bodyAlign);
 }else if(index===1){if(hasPhoto)photo({x:96,y:410,w:888,h:230});const cards=pointCards(slide.body),start=hasPhoto?690:460,height=hasPhoto?155:220,gap=hasPhoto?20:24;
 cards.forEach((value,i)=>{const y=start+i*(height+gap);box(80,y,920,height,['#edf1e8','#f3e7e4','#f6f0e2'][i]);label(`0${i+1}`,105,y+48,32);text(value||'未入力：確認できた魅力を追記してください。',180,y+45,780,height-50,max,24,slide.bodyAlign);});
 }else{if(hasPhoto)photo({x:96,y:410,w:888,h:240});const y=hasPhoto?710:460,h=hasPhoto?300:535;box(80,y,920,h,'#f2e8df');label('BEFORE YOU BUY',110,y+35,19);text(slide.body,110,y+85,860,h-105,max,24,slide.bodyAlign);
 box(80,1060,920,140,t.accent);label('気になったら、商品ページへ',120,1115,36,'#ffffff');label('価格・対応条件は、購入前にもうひと確認。',120,1160,25,'#f1f3e8');}
 ctx.fillStyle='#d3dfd0';ctx.fillRect(80,1230,920,2);label('モノみっけ！',logo?175:85,1280,30);label(`${index+1} / 3`,925,1280,22);
 if(logo){const scale=Math.min(64/logo.width,64/logo.height);ctx.drawImage(logo,85,1240,logo.width*scale,logo.height*scale);}
 return valid?{ok:true}:{ok:false,error:`${index+1}枚目の文字量が多すぎます。短くするか、2枚目は空行で3つのカードに分けてください。内容は省略していません。`};
}
const api={alignedX,themes,segments,fromPost,wrap,fit,pointCards,render};root.MonomikkeCarousel=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
