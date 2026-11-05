(function(root){
const knowledge=typeof module!=='undefined'?require('./knowledge.js'):root.MonomikkeKnowledge;
const categories={tips:{name:'スマホ豆知識',tags:'#スマホ豆知識 #スマホ活用'},phone:{name:'スマホ便利グッズ',tags:'#スマホ便利グッズ #ガジェット'},life:{name:'暮らしの便利グッズ',tags:'#暮らしの便利グッズ #暮らしを整える'},oshi:{name:'推し活グッズ',tags:'#推し活グッズ #推しのいる生活'}};
const styles={explain:'豆知識・解説型',relatable:'共感・あるある型',product:'商品紹介型',compare:'おすすめ・比較型'};
function normalize(s){return s.normalize('NFKC').toLowerCase().replace(/\s/g,'');}
function analyze(category,theme,details=''){
 const item=knowledge.find(k=>k.category===category&&k.aliases.some(a=>normalize(a)===normalize(theme.trim())));
 return {item,needsDetails:!item&&!details.trim(),prompt:category==='tips'?'対象のOS・機種、確認した設定手順、注意点を「伝えたいポイント」に入力してください。':'商品の確認済みの特徴・使う場面・注意点を「伝えたいポイント」に入力してください。比較する場合は、各商品の違いも記載してください。'};
}
function clean(s){return s.split(/\n|(?<=[。！？])/u).filter(line=>!/(?:コメント|返信|リプ|教えて|どう思|みんなは)/u.test(line)).join('\n').trim();}
function localGenerate({category,theme,details='',style='explain',cta='save',productUrl='',variant}){
 theme=theme.trim();details=details.trim();
 if(!categories[category]||!styles[style]||!theme||theme.length>100||details.length>300||!['save','profile','link'].includes(cta))throw Error('入力内容を確認してください。');
 if(cta==='link'){let url;try{url=new URL(productUrl);}catch{}if(!url||url.protocol!=='https:')throw Error('商品リンクにはhttps://から始まるURLを入力してください。');productUrl=url.href;}
 const info=analyze(category,theme,details);if(info.needsDetails){const e=Error(info.prompt);e.code='NEEDS_DETAILS';throw e;}
 const item=info.item;const supplied=clean(details);if(!item&&!supplied)throw Error(info.prompt);
 const n=variant===undefined?Math.floor(Math.random()*3):Math.abs(variant)%3;
 const leads={explain:['まず押さえたいポイント','知っておくと迷いにくいこと','使う前に確認したいこと'],relatable:['使うときに迷わないために','小さな不便を見直すヒント','準備してから気づく前に'],product:['選ぶ前に見ておきたいこと','使う場面から考えるモノ選び','気になるアイテムをチェック'],compare:['自分に合うものを選ぶ基準','比較するときはここを見る','おすすめを決める前の確認リスト']};
 const facts=item?item.facts.map((s,i)=>`${category==='tips'?`${i+1}.`:'✓'} ${s}`).join('\n'):supplied;
 const caution=item?item.caution:(category==='tips'?'記載の手順が自分のOS・機種に合うか確認してから操作してください。':'サイズ・対応条件・お手入れ方法は販売元の商品情報で確認してください。');
 const action=cta==='profile'?'ほかの発見はプロフィールから。':cta==='link'?`商品情報はこちらで確認できます。\n${productUrl}`:['📌 必要なときに見返せるよう保存。','📌 試す前のチェック用に保存してね。','📌 次に選ぶときのメモとして保存。'][n];
 const headings={explain:category==='tips'?'🔎 設定・確認の流れ':'🔎 選び方のポイント',relatable:'💭 迷いやすいところを整理',product:'🛍 特徴・使う場面',compare:'⚖️ 比較するときのチェック項目'};
 const benefit=item?`\n\n💡 ${item.benefit}`:'';
 const extra=item&&supplied?`\n\n📝 伝えたいポイント\n${supplied}`:'';
 const comparison=style==='compare'?'\n\n特定の商品を一番とは決めず、使う場面と確認できた条件を並べて選びましょう。':'';
 const instagram=`${leads[style][n]} ✨\n「${clean(theme)}」\n\n${headings[style]}\n${facts}${benefit}${extra}${comparison}\n\n⚠️ 注意点\n${caution}\n\n${action}\n\n#モノみっけ ${categories[category].tags}`;
 const threadLead={explain:['まずここを確認。','意外と見落としやすいところ。','使う前にひとつメモ。'],relatable:['準備したのに合わない…は避けたい。','小さな使いにくさ、先に確認しておきたい。','あとから気づくより、選ぶ前にメモ。'],product:['買う前に、使う場面を考えてみる。','気になるモノほど、条件を確認。','便利そう、の前にチェック。'],compare:['迷ったら、まず条件を並べてみる。','人気だけで決めずに比較したい。','自分に合うかは、使い方次第。']};
 // Use one complete fact rather than cutting instructions halfway through.
 const summary=item?item.facts[n%item.facts.length]:supplied;
 const threadAction=cta==='link'?`商品情報：${productUrl}`:cta==='profile'?'ほかの発見はプロフィールへ。':'あとで見返せるよう保存。';
 const shortCaution=item?item.caution:category==='tips'?'OS・機種による違いに注意。':'対応条件は販売元で確認してね。';
 const threads=`${threadLead[style][n]}\n「${clean(theme)}」\n\n${summary}\n\n${shortCaution}\n\n${threadAction}`;
 if(Array.from(threads).length>500)throw Error('Threadsの文章が500文字を超えます。テーマ・ポイント・商品URLを短くしてください。');
 return {instagram,threads};
}
// Async provider boundary: future API adapters accept the same input and return {instagram,threads}.
// Keep API credentials on a server; do not embed them in GitHub Pages.
const providers={local:{generate:localGenerate}};
async function generatePost(input,provider=providers.local){return provider.generate(input);}
function generate(category,theme,details='',options={}){return localGenerate({category,theme,details,...options});}
const api={categories,styles,analyze,generate,generatePost,providers};root.Monomikke=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
