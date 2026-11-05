(function(root){
const themes={cream:{name:'クリーム',bg:'#faf4e5',paper:'#fffdf7',accent:'#9a7647',ink:'#453c30'},pink:{name:'くすみピンク',bg:'#f1e0e2',paper:'#fff9f9',accent:'#a36878',ink:'#503d45'},sage:{name:'セージグリーン',bg:'#e3ebe0',paper:'#fafcf7',accent:'#688568',ink:'#344d3d'}};
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
function render(canvas,slide,index,design='cream',logo=null){
 const t=themes[design]||themes.cream;canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.fillStyle=t.bg;ctx.fillRect(0,0,1080,1350);ctx.fillStyle=t.paper;ctx.fillRect(48,48,984,1254);
 ctx.fillStyle=t.accent;if(design==='pink'){ctx.beginPath();ctx.arc(950,80,145,0,Math.PI*2);ctx.fill();}else if(design==='sage'){ctx.fillRect(48,48,22,1254);}else{ctx.fillRect(90,210,100,7);}
 ctx.font='600 28px sans-serif';ctx.fillText(['COVER','GUIDE','CHECK & SAVE'][index],96,155);
 const title=fit(ctx,slide.title,888,250,index===0?76:60,28);const body=fit(ctx,slide.body,888,570,46,24);
 if(!title||!body)return {ok:false,error:`${index+1}枚目の文字量が多すぎます。文章を短くするか改行を減らしてください。内容は省略していません。`};
 function draw(layout,y,color){ctx.fillStyle=color;ctx.font=`600 ${layout.size}px sans-serif`;for(const line of layout.lines){ctx.fillText(line,96,y);y+=layout.size*1.55;}}
 draw(title,300,t.ink);draw(body,590,t.ink);ctx.fillStyle=t.accent;ctx.fillRect(96,1200,888,2);ctx.font='600 30px sans-serif';ctx.fillText('モノみっけ！',logo?180:96,1260);ctx.font='24px sans-serif';ctx.fillText(`${index+1} / 3`,910,1260);
 if(logo){const ratio=Math.min(64/logo.width,64/logo.height);ctx.drawImage(logo,96,1215,logo.width*ratio,logo.height*ratio);}
 return {ok:true,title,body};
}
const api={themes,segments,fromPost,wrap,fit,render};root.MonomikkeCarousel=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
