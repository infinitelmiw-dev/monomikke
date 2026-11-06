(function(root){
const colors={tips:'#F9DCE8',goods:'#FFF0D6',phone:'#FFF0D6',life:'#FFF0D6',oshi:'#EADFFB',notice:'#DDF3E8'};
const labels={tips:'スマホ豆知識',goods:'便利グッズ',phone:'便利グッズ',life:'便利グッズ',oshi:'推し活グッズ',notice:'お知らせ'};
const font='"Monomikke Round", "Hiragino Maru Gothic ProN", sans-serif';
function color(category){return colors[category]||colors.tips;}
function render(canvas,slide,index,logo,options,C){
 canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');const bodyFont=options.fontFamily&&options.fontFamily!=='standard'?C.fontStack(options.fontFamily):font;const bg=color(options.category),ink=/^#[0-9a-f]{6}$/i.test(options.ink||'')?options.ink:'#493D43';ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);let ok=true;
 function box(x,y,w,h,fill,r=24){ctx.fillStyle=fill;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill();}
 function label(s,x,y,size=26,fill=ink){ctx.fillStyle=fill;ctx.font=`700 ${size}px ${font}`;ctx.fillText(s,x,y);}
 function text(value,x,y,w,h,max,align,family=font){const weight=family.includes('Yomogi')?400:700;let layout;for(let size=max;size>=24;size--){ctx.font=`${weight} ${size}px ${family}`;const lines=C.wrap(ctx,value,w);if(lines.length*size*1.55<=h&&lines.every(line=>ctx.measureText(line).width<=w+.1)){layout={lines,size};break;}}if(!layout){ok=false;return;}ctx.font=`${weight} ${layout.size}px ${family}`;ctx.fillStyle=ink;layout.lines.forEach((line,i)=>ctx.fillText(line,C.alignedX(x,w,ctx.measureText(line).width,align),y+i*layout.size*1.55));}
 box(80,65,290,52,'#fffaf6');label(labels[options.category]||labels.tips,102,101,25);label(`${index+1} / 3`,905,104,25);
 text(slide.title,80,230,920,165,76,slide.titleAlign);
 const rect={x:96,y:430,w:888,h:350};box(80,414,920,382,'#ffffff',0);
 if(options.photo){if(options.provided)label('楽天市場の商品',96,399,22);ctx.save();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();const p=C.crop(options.photo,rect,options.provided?1:options.zoom,options.provided?0:options.x,options.provided?0:options.y,options.provided?'contain':options.mode);ctx.filter='none';ctx.drawImage(options.photo,p.x,p.y,p.w,p.h);ctx.restore();}
 else{box(440,465,200,255,bg,28);ctx.strokeStyle=ink;ctx.lineWidth=5;ctx.strokeRect(460,485,160,200);label('✦',362,555,64);label('♡',684,670,60);label('小さな発見を、毎日のヒントに。',270,750,30);}
 box(80,825,920,250,'#fffaf7');text(slide.body,105,875,870,225,Math.max(24,Math.min(54,Number(options.font)||40)),slide.bodyAlign,bodyFont);
 if(options.character){const p=C.crop(options.character,{x:85,y:1100,w:200,h:185},1,0,0,'contain');ctx.drawImage(options.character,p.x,p.y,p.w,p.h);}
 else{ctx.strokeStyle=ink;ctx.lineWidth=5;box(117,1150,130,115,'#fffaf0',16);ctx.beginPath();ctx.arc(182,1147,32,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(117,1210);ctx.lineTo(99,1222);ctx.moveTo(247,1210);ctx.lineTo(265,1222);ctx.stroke();ctx.fillStyle=ink;ctx.beginPath();ctx.arc(159,1195,5,0,Math.PI*2);ctx.arc(205,1195,5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(182,1204,14,0,Math.PI);ctx.stroke();box(137,1207,14,7,'#edc6cd',3);box(213,1207,14,7,'#edc6cd',3);}
 box(610,1165,390,92,'#fffaf7',30);label('保存して、あとで見る',645,1222,28);label('モノみっけ！',440,1305,25);if(logo){const p=C.crop(logo,{x:375,y:1260,w:48,h:48},1,0,0,'contain');ctx.drawImage(logo,p.x,p.y,p.w,p.h);}
 return ok?{ok:true}:{ok:false,error:`${index+1}枚目の文字量が多すぎます。見出し・本文を短くするか改行を減らしてください。文章は省略していません。`};
}
const api={colors,labels,font,color,render};root.MonomikkeBrand=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
