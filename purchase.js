(function(root){
function clean(s){return (s||'').split(/\n|(?<=[。！？])/u).filter(line=>!/(コメント|返信|リプ|教えて|どう思|みんなは)/u.test(line)).join('\n').trim();}
function unique(values){const seen=new Set();return values.map(clean).filter(value=>value&&!seen.has(value)&&seen.add(value));}
// Only remove known promotional wrappers; never abbreviate brands, model codes or wattage.
function displayName(formal){return clean(formal).replace(/[【［\[](?:公式|公式ショップ|送料無料|送料込み|楽天ランキング1位|ポイント\d+倍)[】］\]]/gu,'').replace(/\s+/g,' ').trim();}
function generate(input){const p=input.product||{},name=displayName(p.name);if(!name)throw Error('購入につながる紹介文には商品名を入力してください。');const mode=input.purchaseMode||'empathy';if(!['empathy','convenience','compare'].includes(mode))throw Error('紹介文パターンを確認してください。');
 const n=(input.variant||0)%3;const concern=clean(input.readerConcern);const problems=concern||{empathy:'自分の暮らしに合うものを選びたい',convenience:'毎日の小さな手間を減らしたい',compare:'似た商品があると、どれを選ぶか迷う'}[mode];
 const concernLine=problems.replace(/[。！？!?]+$/u,'');
 const openings={empathy:[`${concernLine}…。そんな悩み、ありますよね。`,`${concernLine}。そんなときに、選び方を少し見直してみませんか。`,`${concernLine}…。買う前に、自分に合うか考えておきたいですよね。`],convenience:[`${concernLine}。いつもの使い方に合うものを探したいですよね。`,`${concernLine}。日々の使いやすさを大切にしたいときに。`,`${concernLine}…。少しでも扱いやすいものを選びたいですよね。`],compare:[`${concernLine}。迷ったら、使う場面から比べてみませんか。`,`${concernLine}…。人気だけでなく、自分に合うかも大切ですよね。`,`${concernLine}。買う前に、必要な条件を見つめ直してみましょう。`]};
 const field=s=>clean(s).split('\n').map(line=>{for(const prefix of [clean(p.name)+'は',name+'は'])if(line.startsWith(prefix))return line.slice(prefix.length);return line;}).join('\n');
 // Benefits come only from the user's supplied text; specs do not imply new benefits.
 const facts=unique([field(p.benefits),field(p.features)]);const benefits=facts.join('\n\n')||'どんな使い方に向いているかは、商品ページで追加確認が必要です。';
 const caveats=clean(p.caution)||'対応条件や販売元の案内も、商品ページで見ておいてくださいね。';
 const price=p.price?`${clean(p.price)}${p.priceDate?`（${p.priceDate}確認時点）`:''}。価格は変わることがあるので、最新情報は商品ページで。`:'';
 const url=input.productUrl||'';if(url&&new URL(url).protocol!=='https:')throw Error('商品URLはHTTPSを指定してください。');
 const instagramAction=input.cta==='profile'?'詳しくはプロフィールのリンクから見てみてね。':url?`気になったら、商品ページでもっと詳しく。\n${url}`:'商品ページのURLは追加確認が必要です。';
 const threadAction=url?`商品ページ：${url}`:instagramAction;const pr=p.ad?'PR｜商品紹介\n':'';
 const intros={empathy:['そんなときの候補に。','気になる選択肢のひとつがこちら。','自分の使い方と照らし合わせたいのがこちら。'],convenience:['毎日の使い方を考えながら選びたいのがこちら。','使いやすさを大切に選ぶなら、こんな候補も。','暮らしに取り入れる前に見ておきたい一品。'],compare:['比べる候補のひとつとして。','自分に必要な条件と照らし合わせて。','ほかの候補と並べて考えたいのがこちら。']};
 const detail=`${benefits}${p.shipping?'\n\n送料：'+clean(p.shipping):''}${price?'\n\n'+price:''}`;
 const instagram=`${pr}${openings[mode][n]}\n\n${intros[mode][n]}\n${name}\n\n${detail}\n\nただ、ここも忘れずに。\n${caveats}\n\n${instagramAction}\n\n#モノみっけ #商品紹介`;
 const summary=facts[0]||'どんな使い方に合うかは、商品ページで追加確認を。';
 const shortOpen={empathy:[`${concernLine}…。選ぶ前に見ておきたい。`,`${concernLine}。そんなときの候補に。`,`${concernLine}…。自分に合うものを探したい。`],convenience:[`${concernLine}。使いやすさも大切に。`,`${concernLine}。いつもの使い方と合わせて選びたい。`,`${concernLine}…。選び方を少し見直したい。`],compare:[`${concernLine}。使う場面で比べてみるのもよさそう。`,`${concernLine}…。必要な条件から選びたい。`,`${concernLine}。こんな候補も並べて考えてみる。`]};
 let threads=`${pr}${shortOpen[mode][n]}\n\n${name}\n${summary}\n\n${clean(p.caution)||'買う前に、対応条件も見ておいてね。'}\n\n${threadAction}`;
 if(Array.from(threads).length>500)threads=`${pr}${problems}\n\n${name}\n${summary}\n\n購入条件は販売元で確認。\n※情報量が多いためリンクは本文には未掲載です。原文リンクを別途コピーして掲載方法を確認してください。`;
 if(Array.from(threads).length>500)throw Error('商品情報を短くしてください。URLは変更していません。');
 const coverTitles={empathy:['選ぶ前の悩みを整理','使う場面から選ぼう','購入前の迷いをチェック'],convenience:['毎日の使いやすさを確認','便利さのポイントを整理','使いやすさを選ぶヒント'],compare:['自分に合う条件を比較','購入前の比較メモ','選ぶ基準をチェック']};
 const coverTitle=coverTitles[mode][n];
 const slides=[{title:coverTitle,body:`${pr}${name}\n${problems}`},{title:'こんな使い方に',body:unique([benefits,price]).join('\n\n')},{title:'買う前に見ておきたいこと',body:`${pr}${caveats}\n\n${instagramAction}`}];
 return {instagram,threads,coverTitle,slides};
}
const api={generate,displayName};root.MonomikkePurchase=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
