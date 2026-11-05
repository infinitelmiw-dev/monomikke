(function(root){
function clean(s){return (s||'').split(/\n|(?<=[。！？])/u).filter(line=>!/(コメント|返信|リプ|教えて|どう思|みんなは)/u.test(line)).join('\n').trim();}
function unique(values){const seen=new Set();return values.map(clean).filter(value=>value&&!seen.has(value)&&seen.add(value));}
function generate(input){const p=input.product||{},name=clean(p.name);if(!name)throw Error('購入につながる紹介文には商品名を入力してください。');const mode=input.purchaseMode||'empathy';if(!['empathy','convenience','compare'].includes(mode))throw Error('紹介文パターンを確認してください。');
 const n=(input.variant||0)%3;const concern=clean(input.readerConcern);const problems=concern||{empathy:'自分の使い方に合うか、買う前に確かめたい。',convenience:'毎日の使い方を、少しでも扱いやすくしたい。',compare:'候補を比べても、何を基準に選ぶか迷いやすい。'}[mode];
 const hooks={empathy:['こんな悩みから、選び方を考える。','購入前の迷いを整理しよう。','使う場面を思い浮かべてみる。'],convenience:['便利さは、使う場面から確認。','毎日の使いやすさに注目。','手間を見直すためのモノ選び。'],compare:['自分に合う条件で比べよう。','選ぶ前に、比較する軸を整理。','違いは確認できる情報で比べる。']};
 const field=s=>clean(s).split('\n').map(line=>line.startsWith(name+'は')?line.slice((name+'は').length):line).join('\n');
 const facts=unique([field(p.features),field(p.benefits)]);const benefits=facts.join('\n')||'特徴・メリットは未入力です。販売元の情報で追加確認が必要です。';
 const caveats=unique([p.caution,'価格・仕様・対応条件は購入前に販売元で再確認してください。']).join('\n');
 const price=p.price?`価格：${clean(p.price)}${p.priceDate?`（${p.priceDate}確認）`:''}`:'';
 const url=input.productUrl||'';if(url&&new URL(url).protocol!=='https:')throw Error('商品URLはHTTPSを指定してください。');
 const instagramAction=input.cta==='profile'?'商品ページはプロフィールのリンクから確認してください。':url?`商品ページで詳細を確認\n${url}`:'商品ページのURLは追加確認が必要です。';
 const threadAction=url?`商品ページ：${url}`:instagramAction;const pr=p.ad?'PR｜商品紹介\n':'';
 const headings=[['使う場面の悩み','確認済みの特徴・メリット','購入前の注意点'],['選ぶ前に整理','使いやすさの確認ポイント','チェックしてから購入へ'],['こんな場面を想定','選ぶ判断材料','買う前のチェックリスト']][n];
 const detail=`${headings[1]}\n${benefits}${price?'\n'+price:''}`;
 const instagram=`${pr}${hooks[mode][n]}\n${name}\n\n${headings[0]}\n${problems}\n\n${detail}\n\n${headings[2]}\n${caveats}\n\n${instagramAction}\n\n#モノみっけ #商品紹介`;
 const bridges={empathy:['気になるポイントを整理。','使う場面に合うか確認。','迷ったら、ここからチェック。'],convenience:['使いやすさの判断材料はこちら。','日常の使い方と照らし合わせて。','便利さを確認するポイント。'],compare:['比較するときの確認ポイント。','ほかの候補とも条件を比べよう。','自分に必要な条件で検討。']};
 const bridge=bridges[mode][n];
 const summary=facts[0]||'特徴・メリットは販売元で追加確認。';let threads=`${pr}${problems}\n\n${name}\n${bridge}\n${summary}\n\n${clean(p.caution)||'対応条件は購入前に確認。'}\n\n${threadAction}`;
 if(Array.from(threads).length>500)threads=`${pr}${problems}\n\n${name}\n${bridge}\n${summary}\n\n購入条件・注意点は販売元で確認。\n※情報量が多いためリンクは本文には未掲載です。原文リンクを別途コピーして掲載方法を確認してください。`;
 if(Array.from(threads).length>500)throw Error('商品情報を短くしてください。URLは変更していません。');
 const coverTitles={empathy:['選ぶ前の悩みを整理','使う場面から選ぼう','購入前の迷いをチェック'],convenience:['毎日の使いやすさを確認','便利さのポイントを整理','使いやすさを選ぶヒント'],compare:['自分に合う条件を比較','購入前の比較メモ','選ぶ基準をチェック']};
 const coverTitle=coverTitles[mode][n];
 const slides=[{title:coverTitle,body:`${pr}${name}\n${problems}`},{title:'特徴・メリット',body:unique([benefits,price]).join('\n\n')},{title:'購入前の確認・まとめ',body:`${pr}${caveats}\n\n${instagramAction}`}];
 return {instagram,threads,coverTitle,slides};
}
const api={generate};root.MonomikkePurchase=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
