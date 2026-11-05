(function(root){
const knowledge=typeof module!=='undefined'?require('./knowledge.js'):root.MonomikkeKnowledge;
const categories={tips:{name:'スマホ豆知識',tags:'#スマホ豆知識 #スマホ活用'},phone:{name:'スマホ便利グッズ',tags:'#スマホ便利グッズ #ガジェット'},life:{name:'暮らしの便利グッズ',tags:'#暮らしの便利グッズ #暮らしを整える'},oshi:{name:'推し活グッズ',tags:'#推し活グッズ #推しのいる生活'}};
const styles={explain:'豆知識・解説型',relatable:'共感・あるある型',product:'商品紹介型',compare:'おすすめ・比較型'};
function normalize(s){return s.normalize('NFKC').toLowerCase().replace(/アンドロイド/g,'android').replace(/アイフォン|アイフォーン/g,'iphone').replace(/wi[‐‑–-]?fi/g,'wifi').replace(/スマートフォン/g,'スマホ').replace(/バッテリー/g,'電池').replace(/長もち/g,'長持ち').replace(/[\s「」『』？！?!。、・]/g,'');}
function searchKey(s){return normalize(s).replace(/する方法|させる方法|の方法|について|したい|してください|教えて|使い方|方法/g,'').replace(/[のをがには]/g,'').replace(/(?:変更|する|させる)$/,'');}
function analyze(category,theme,details=''){
 const query=normalize(theme.trim());const key=searchKey(theme);
 const candidates=knowledge.filter(k=>k.category===category).filter(k=>{
   const text=k.aliases.join(' ').toLowerCase();
   return !(query.includes('android')&&text.includes('iphone'))&&!(query.includes('iphone')&&text.includes('android'));
 });
 const exact=candidates.find(k=>k.aliases.some(a=>normalize(a)===query));
 const ranked=candidates.map(item=>({item,score:Math.max(...item.aliases.map(a=>{const alias=searchKey(a);if(alias.length<4||key.length<4)return 0;if(key===alias)return 1;if(key.includes(alias))return .85+Math.min(alias.length/key.length,.99)*.1;return 0;}))})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 // Conflicting topics should use a general draft instead of selecting an arbitrary procedure.
 const item=exact || (ranked.length&&(!ranked[1]||ranked[0].score-ranked[1].score>.04)?ranked[0].item:undefined);
 return {item,needsDetails:false,prompt:item?'内蔵データを参考に下書きを作成します。伝えたいポイントは任意です。':'テーマだけでも下書きを作成できます。具体的な手順・特徴は追加確認が必要です。伝えたいポイントを入力すると優先して反映します。'};
}
function clean(s){return s.split(/\n|(?<=[。！？])/u).filter(line=>!/(?:コメント|返信|リプ|教えて|どう思|みんなは)/u.test(line)).join('\n').trim();}
function localGenerate({category,theme,details='',style='explain',cta='save',productUrl='',opening='empathy',variant}){
 theme=theme.trim();details=details.trim();
 if(!categories[category]||!styles[style]||!['empathy','question','surprise'].includes(opening)||!theme||theme.length>100||details.length>300||!['save','profile','link'].includes(cta))throw Error('入力内容を確認してください。');
 if(cta==='link'){let url;try{url=new URL(productUrl);}catch{}if(!url||url.protocol!=='https:')throw Error('商品リンクにはhttps://から始まるURLを入力してください。');}
 const info=analyze(category,theme,details);
 const item=info.item;const supplied=clean(details);
 const fallback=category==='tips'?'対象のOS・機種を確認し、メーカーの公式ヘルプで利用条件と手順を確認しましょう。具体的な設定手順・注意点は追加確認が必要です。':'使いたい場面を整理し、販売元の商品情報で特徴・対応条件を確認しましょう。具体的な仕様・メリット・注意点は追加確認が必要です。';
 const n=variant===undefined?Math.floor(Math.random()*3):Math.abs(variant)%3;
 const subject=Array.from(clean(item?.title||theme)).slice(0,28).join('');
 const hooks={empathy:[`「${subject}」、何から見直すか迷いますよね。`,`「${subject}」、使う前に整理しておきたい。`,`「${subject}」の確認を、後回しにしないために。`],question:[`「${subject}」、まず何を確認する？`,`「${subject}」で注意したい点は？`,`「${subject}」、自分の条件に合っている？`],surprise:[`「${subject}」は、注意点から見るのもひとつの方法。`,`「${subject}」、手順以外の条件にも注目。`,`「${subject}」は、確認リストで整理してみよう。`]};
 const hook=hooks[opening][n];
 const leads={explain:['まず押さえたいポイント','知っておくと迷いにくいこと','使う前に確認したいこと'],relatable:['使うときに迷わないために','小さな不便を見直すヒント','準備してから気づく前に'],product:['選ぶ前に見ておきたいこと','使う場面から考えるモノ選び','気になるアイテムをチェック'],compare:['自分に合うものを選ぶ基準','比較するときはここを見る','おすすめを決める前の確認リスト']};
 const facts=supplied?`📝 伝えたいポイント\n${supplied}`:item?item.facts.map((s,i)=>`${category==='tips'?`${i+1}.`:'✓'} ${s}`).join('\n'):fallback;
 const caution=!item?'このテーマに一致する内蔵データはありません。具体的な情報は追加確認が必要です。':supplied?'入力された内容の正確性・対象条件は追加確認が必要です。':item.caution;
 const action=cta==='profile'?'ほかの発見はプロフィールから。':cta==='link'?`商品情報はこちらで確認できます。\n${productUrl}`:['📌 必要なときに見返せるよう保存。','📌 試す前のチェック用に保存してね。','📌 次に選ぶときのメモとして保存。'][n];
 const headings={explain:category==='tips'?'🔎 設定・確認の流れ':'🔎 選び方のポイント',relatable:'💭 迷いやすいところを整理',product:'🛍 特徴・使う場面',compare:'⚖️ 比較するときのチェック項目'};
 const structure=n===0?(item&&!supplied?`${category==='tips'?'設定・確認':'選ぶ前の確認'}${item.facts.length}項目`:'確認する内容を整理'):n===1?'失敗を避けるために先に確認':'使う前のチェックリスト';
 const benefit=item&&!supplied?`\n\n💡 ${item.benefit}`:'';
 const extra='';
 const comparison=style==='compare'?'\n\n特定の商品を一番とは決めず、使う場面と確認できた条件を並べて選びましょう。':'';
 let instagram=`${hook} ✨\n${leads[style][n]}\n「${clean(theme)}」\n\n${structure}\n${headings[style]}\n${facts}${benefit}${extra}${comparison}\n\n⚠️ 注意点\n${caution}\n\n${action}\n\n#モノみっけ ${categories[category].tags}`;
 const topicHeader=`「${clean(theme)}」`;
 if(n===1)instagram=`${hook} ✨\n${topicHeader}\n\n⚠️ 先に確認\n${caution}\n\n${structure}\n${headings[style]}\n${facts}${benefit}${comparison}\n\n${action}\n\n#モノみっけ ${categories[category].tags}`;
 if(n===2)instagram=`${hook} ✨\n${topicHeader}${benefit}\n\n${structure}\n${headings[style]}\n${facts}${comparison}\n\n⚠️ 注意点\n${caution}\n\n${action}\n\n#モノみっけ ${categories[category].tags}`;
 // Use one complete fact rather than cutting instructions halfway through.
 const summary=supplied||(item?item.facts[n%item.facts.length]:fallback);
 const threadAction=cta==='link'?`商品情報：${productUrl}`:cta==='profile'?'ほかの発見はプロフィールへ。':'あとで見返せるよう保存。';
 const shortCaution=!item?'具体的な情報は追加確認が必要です。':supplied?'入力内容の正確性・対象条件は追加確認が必要です。':item.caution;
 let threads=`${hook}\n「${clean(theme)}」\n\n${summary}\n\n${shortCaution}\n\n${threadAction}`;
 if(n===1)threads=`${hook}\n${topicHeader}\n\n先に確認：${shortCaution}\n\n${summary}\n\n${threadAction}`;
 if(n===2)threads=`${hook}\n${topicHeader}\n\n${summary}\n\n${threadAction}\n\n注意：${shortCaution}`;
 if(Array.from(threads).length>500){const brief=supplied?Array.from(supplied).slice(0,120).join('')+'…（ポイントの一部を抜粋・全文はInstagram用へ）':summary;threads=`${hook}\n「${clean(theme)}」\n\n${brief}\n\n${shortCaution}\n\n${threadAction}`;}
 if(Array.from(threads).length>500)throw Error('商品URLが長いためThreadsの500文字を超えます。短い公式URLを入力してください。');
 return {instagram,threads};
}
// Async provider boundary: future API adapters accept the same input and return {instagram,threads}.
// Keep API credentials on a server; do not embed them in GitHub Pages.
const providers={local:{generate:localGenerate}};
async function generatePost(input,provider=providers.local){return provider.generate(input);}
function generate(category,theme,details='',options={}){return localGenerate({category,theme,details,...options});}
const api={categories,styles,analyze,generate,generatePost,providers};root.Monomikke=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
