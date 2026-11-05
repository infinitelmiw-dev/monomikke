(function(root){
function compose(input,base){const p=input.product;if(!p?.name?.trim())return base;
 const clean=s=>(s||'').split(/\n|(?<=[。！？])/u).filter(line=>!/(?:コメント|返信|リプ|教えて|どう思|みんなは)/u.test(line)).join('\n').trim();
 const name=clean(p.name);if(!name)return base;const fields=[['確認済みの特徴',p.features],['確認済みのメリット',p.benefits],['確認時点の価格',p.price],['注意点',p.caution]].filter(x=>clean(x[1])).map(([label,value])=>`${label}：${clean(value)}`);
 const caution=p.caution?'価格・仕様・販売条件は投稿前に販売元で再確認してください。':'注意点・対応条件は追加確認が必要です。価格・仕様は販売元で再確認してください。';
 const link=input.productUrl?`商品情報：${new URL(input.productUrl).href}`:'';if(link&&new URL(input.productUrl).protocol!=='https:')throw Error('商品URLはHTTPSを指定してください。');
 const action=link||(input.cta==='profile'?'詳しくはプロフィールから。':'あとで見返せるよう保存。');const heading=base.instagram.split('\n')[0];const disclosure=p.ad?'PR｜商品紹介\n':'';
 const blocks=[fields.join('\n\n'),caution];if(input.variant%3===1)blocks.reverse();if(input.variant%3===2)blocks[0]='チェックリスト\n'+blocks[0];
 const instagram=`${disclosure}${heading}\n${name}\n\n${blocks.join('\n\n')}\n\n${action}\n\n#モノみっけ #商品紹介`;
 let threads=`${disclosure}${heading}\n${name}\n\n${fields.join('\n')}\n\n${caution}\n\n${action}`;
 if(Array.from(threads).length>500)threads=`${disclosure}${name}\n\n${fields.filter(x=>!x.startsWith('注意点')).join('\n')}\n\n注意点の全文はInstagram用下書きで確認。販売条件は要確認。\n\n${action}`;
 if(Array.from(threads).length>500)throw Error('商品情報とURLを短くしてください（Threadsは500文字以内）。');
 return {instagram,threads};
}
function crop(image,box,zoom=1,x=0,y=0,mode='contain'){
 const base=mode==='cover'?Math.max(box.w/image.width,box.h/image.height):Math.min(box.w/image.width,box.h/image.height);const scale=base*zoom;
 const w=image.width*scale,h=image.height*scale;return {x:box.x+(box.w-w)/2+x*box.w/2,y:box.y+(box.h-h)/2+y*box.h/2,w,h};
}
const api={compose,crop};root.MonomikkeProduct=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
