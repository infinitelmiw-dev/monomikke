(function(){
const $=id=>document.getElementById(id);let post=null,save=null,logo=null;let photos=[];let photoKinds=[];let photoNames=[];
// Fontsource's jsDelivr CDN is preferred; Google Fonts remains a fallback.
const cuteFonts={
 round:{family:'Zen Maru Gothic',weight:700,urls:[
   'https://cdn.jsdelivr.net/npm/@fontsource/zen-maru-gothic@5.2.8/700.css',
   'https://unpkg.com/@fontsource/zen-maru-gothic@5.2.8/700.css',
   'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700&display=swap']},
 hand:{family:'Yomogi',weight:400,urls:[
   'https://unpkg.com/@fontsource/yomogi@5.2.8/400.css',
   'https://cdn.jsdelivr.net/npm/@fontsource/yomogi@5.2.8/400.css',
   'https://fonts.googleapis.com/css2?family=Yomogi&display=swap']},
 pop:{family:'M PLUS Rounded 1c',weight:700,urls:[
   'https://unpkg.com/@fontsource/m-plus-rounded-1c@5.2.8/700.css',
   'https://cdn.jsdelivr.net/npm/@fontsource/m-plus-rounded-1c@5.2.8/700.css',
   'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700&display=swap']}
};
const loadedFonts=new Set(['standard']);
const failedFonts=new Set();
const fontLoadsPending=new Set();
async function ensureFont(key){
 if(!cuteFonts[key]||loadedFonts.has(key))return true;
 const font=cuteFonts[key];
 const timeout=(promise,ms)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(Error('接続の時間切れ')),ms))]);
 let lastError='通信先に接続できませんでした';
 for(let i=0;i<font.urls.length;i++){
  const link=document.createElement('link');link.rel='stylesheet';
  link.dataset.monomikkeFont=key;
  link.href=font.urls[i];
  try{
   $('image-font-status').textContent='文字フォントを読み込んでいます（配信元 '+(i+1)+'/'+font.urls.length+'）…';
   const ready=new Promise((resolve,reject)=>{
    link.addEventListener('load',resolve,{once:true});
    link.addEventListener('error',()=>reject(Error('配信元に接続できませんでした')),{once:true});
   });
   document.head.append(link);
   await timeout(ready,9000);
   const target=font.weight+' 32px "'+font.family+'"';
   const faces=await timeout(document.fonts.load(target,'あいうえお漢字'),13000);
   if(!faces.length||!document.fonts.check(target,'あいうえお漢字'))throw Error('日本語のフォントデータが取得できませんでした');
   loadedFonts.add(key);failedFonts.delete(key);
   $('image-font-status').textContent='かわいいフォントの読み込みに成功しました。';
   return true;
  }catch(error){
   lastError=error.message;
   link.remove();
  }
 }
 failedFonts.add(key);
 $('image-font-status').textContent='フォントを読み込めませんでした（'+lastError+'）。配信元を切り替えて試しましたが接続できません。選択は保存されています。「フォントを再読み込み」で再試行できます。';
 $('retry-image-font').hidden=false;
 console.warn('フォントの複数配信元への接続失敗',key,lastError);
 return false;
}
function gallery(){const list=$('photo-gallery');list.replaceChildren();photos.forEach((photo,i)=>{const item=document.createElement('button');item.type='button';item.className='photo-thumb';const canvas=document.createElement('canvas');canvas.width=120;canvas.height=90;const scale=Math.min(120/photo.width,90/photo.height);canvas.getContext('2d').drawImage(photo,(120-photo.width*scale)/2,(90-photo.height*scale)/2,photo.width*scale,photo.height*scale);canvas.setAttribute('aria-label',photoNames[i]);const name=document.createElement('span');name.textContent=photoNames[i];item.append(canvas,name);item.onclick=()=>{if(!requirePost())return;if(!state()){notice('先に「文章から画像を作る」で画像編集を開いてください。');return;}state().slides[0].photo={index:i,zoom:1,x:0,y:0,mode:'contain'};state().photoMode=photoKinds[i];save();select(post,save);$('image-fields').scrollIntoView({behavior:'smooth',block:'start'});};list.append(item);});}
function ensureSlides(){if(state())return;post.carousel={photoMode:$('photo-kind').value,design:$('image-design').value,source:post.texts.instagram,slides:(post.purchaseSlides&&post.texts.instagram===post.generatedPurchaseSource?post.purchaseSlides:MonomikkeCarousel.fromPost(post.product?.name||post.theme,post.texts.instagram)).map(slide=>({...slide}))};}
function notice(message){$('image-status').textContent=message;const toast=$('toast');if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000);}}
function requirePost(){if(post&&post.texts&&typeof post.texts.instagram==='string')return true;notice('先に投稿を生成するか、投稿履歴から「開く・編集」で投稿を選んでください。');return false;}
function state(){return post?.carousel;}
function select(next,onSave){try{return renderSelection(next,onSave);}catch(error){notice('画像編集を表示できませんでした。投稿文章と保存データは削除していません。ページを再読み込みしてください。');console.warn('画像編集の表示エラー',error);return false;}}
function renderSelection(next,onSave){post=next;save=onSave;gallery();$('image-fields').replaceChildren();if(!requirePost())return false;
 const data=state();const renderer=globalThis.MonomikkeCarousel;const design=data?.design||$('image-design').value||'cream';const supported=!!renderer?.themes?.[design]&&typeof renderer.render==='function';const palette=renderer?.themes?.[design]||{bg:'#e3ebe0',ink:'#344d3d'};if(data?.photoMode)$('photo-kind').value=data.photoMode;$('product-photos').disabled=$('photo-kind').value==='none';$('image-bg').value=data?.bg||palette.bg;$('image-ink').value=data?.ink||palette.ink;$('image-font').value=data?.font||46;$('image-font-family').value=data?.fontFamily||'standard';const selectedFont=data?.fontFamily||'standard';$('retry-image-font').hidden=selectedFont==='standard'||loadedFonts.has(selectedFont);if(selectedFont==='standard'||loadedFonts.has(selectedFont))$('image-font-status').textContent='';if(!Array.from($('image-design').options).some(option=>option.value===design))$('image-design').add(new Option('保存済みの未対応デザイン',design));$('image-design').value=design;$('image-stale').textContent=data&&data.source!==post.texts.instagram?'元のInstagram文章が変更されています。画像にはまだ反映されていません。必要なら「文章から画像を作る」で更新してください。':'';
 if(!data){$('image-status').textContent='「文章から画像を作る」を押すと、現在のInstagram文章から3枚を作成します。';return;}
 if(data.fontFamily&&data.fontFamily!=='standard'&&!loadedFonts.has(data.fontFamily)&&!failedFonts.has(data.fontFamily)&&!fontLoadsPending.has(data.fontFamily)){fontLoadsPending.add(data.fontFamily);ensureFont(data.fontFamily).then(ok=>{fontLoadsPending.delete(data.fontFamily);if(ok&&post===next&&state()?.fontFamily===data.fontFamily)select(post,save);});}
 if(!Array.isArray(data.slides)||data.slides.length!==3||data.slides.some(slide=>!slide||typeof slide!=='object')){notice('保存済みの画像編集データの形式を読み取れません。元データと文章は保持しています。必要ならJSONをバックアップしてから画像を作り直してください。');return false;}
 data.slides.forEach((slide,i)=>{const card=document.createElement('section');card.className='image-card';const label=document.createElement('h3');label.textContent=`${i+1}枚目：${['表紙','解説','まとめ'][i]}`;const title=document.createElement('textarea');title.value=slide.title;title.rows=2;title.setAttribute('aria-label',`${i+1}枚目の見出し`);const body=document.createElement('textarea');body.value=slide.body;body.rows=6;body.setAttribute('aria-label',`${i+1}枚目の本文`);
 let ctaPanel=null,ctaTitleInput=null,ctaSubtitleInput=null;
 if(i===2&&design==='magazine'){
  ctaPanel=document.createElement('div');ctaPanel.className='text-alignment';
  const profile=post.cta==='profile',link=post.cta==='link';
  const initialTitle=profile?'商品の詳細はプロフィールから！':link?'商品の詳細はこちら':'あとで見返せるように保存';
  const initialNote=profile?'プロフィールのリンク一覧で商品名を選んでね。':link?'価格・対応条件は購入前に確認してね。':'気になったポイントを保存しておこう。';
  function ctaField(key,caption,initial,maxLength){
   const wrap=document.createElement('label');wrap.textContent=caption;
   const input=document.createElement('input');input.type='text';input.maxLength=maxLength;
   input.setAttribute('aria-label',caption);input.value=typeof slide[key]==='string'?slide[key]:initial;
   input.oninput=()=>{slide[key]=input.value;save();paint();};
   wrap.append(input);ctaPanel.append(wrap);return input;
  }
  ctaTitleInput=ctaField('ctaTitle','3枚目：緑色の帯の見出し',initialTitle,70);
  ctaSubtitleInput=ctaField('ctaSubtitle','3枚目：緑色の帯の補足文',initialNote,90);
  const help=document.createElement('p');help.className='hint';help.textContent='帯の文章だけ編集できます。写真は変更しません。空欄にするとその行を非表示にできます。';ctaPanel.append(help);
 }
 const alignment=document.createElement('div');alignment.className='text-alignment';for(const [key,label]of [['titleAlign','見出し'],['bodyAlign','本文']]){const wrapper=document.createElement('label');wrapper.textContent=label+'の配置';const selector=document.createElement('select');selector.setAttribute('aria-label',`${i+1}枚目の${label}の配置`);for(const [value,text]of [['left','左揃え'],['center','中央揃え'],['right','右揃え']])selector.add(new Option(text,value));selector.value=['left','center','right'].includes(slide[key])?slide[key]:'left';selector.onchange=()=>{slide[key]=selector.value;save();paint();};wrapper.append(selector);alignment.append(wrapper);}const canvas=document.createElement('canvas');canvas.setAttribute('aria-label',`${i+1}枚目の画像プレビュー`);const error=document.createElement('p');error.className='hint image-error';error.setAttribute('role','status');const download=document.createElement('button');download.type='button';download.textContent=`${i+1}枚目をPNGで保存`;
 const transform={index:-1,zoom:1,x:0,y:0,mode:'contain',...(slide.photo&&typeof slide.photo==='object'?slide.photo:{})};function saveTransform(){slide.photo={...transform};save();}
 const photoSelect=document.createElement('select');photoSelect.setAttribute('aria-label',`${i+1}枚目の写真`);photoSelect.add(new Option('写真なし',-1));photos.forEach((p,j)=>photoSelect.add(new Option(`写真${j+1}：${photoNames[j]}`,j)));photoSelect.value=photos[transform.index]?transform.index:-1;photoSelect.onchange=()=>{transform.index=Number(photoSelect.value);saveTransform();paint();};
 const mode=document.createElement('select');mode.setAttribute('aria-label',`${i+1}枚目のトリミング`);mode.add(new Option('全体表示（変形なし）','contain'));mode.add(new Option('枠いっぱいにトリミング','cover'));mode.value=transform.mode;mode.onchange=()=>{transform.mode=mode.value;saveTransform();paint();};
 const controls=document.createElement('div');controls.className='photo-controls';controls.append(photoSelect,mode);
 const sliders={};for(const [key,label,min,max,step]of [['zoom','拡大・縮小',.25,4,.05],['x','左右移動',-1,1,.01],['y','上下移動',-1,1,.01]]){const wrapper=document.createElement('label');wrapper.textContent=label;const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=transform[key];input.setAttribute('aria-label',`${i+1}枚目の${label}`);input.oninput=()=>{transform[key]=Number(input.value);saveTransform();paint();};sliders[key]=input;wrapper.append(input);controls.append(wrapper);}
 const pointers=new Map();let gesture=null;canvas.style.touchAction='none';canvas.onpointerdown=e=>{if(!photos[transform.index]||photoKinds[transform.index]==='provided'||data.photoMode==='provided'||data.photoMode==='none')return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});gesture={points:[...pointers.values()],x:transform.x,y:transform.y,zoom:transform.zoom};};canvas.onpointermove=e=>{if(!pointers.has(e.pointerId)||!gesture)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...pointers.values()];if(points.length===2&&gesture.points.length===2){const distance=a=>Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);transform.zoom=Math.max(.25,Math.min(4,gesture.zoom*distance(points)/Math.max(1,distance(gesture.points))));}else if(points.length===1&&gesture.points.length===1){const scale=1080/canvas.getBoundingClientRect().width;transform.x=Math.max(-1,Math.min(1,gesture.x+(points[0].x-gesture.points[0].x)*scale/444));transform.y=Math.max(-1,Math.min(1,gesture.y+(points[0].y-gesture.points[0].y)*scale/200));}for(const key of ['zoom','x','y'])sliders[key].value=transform[key];paint();};canvas.onpointerup=canvas.onpointercancel=e=>{pointers.delete(e.pointerId);gesture=null;saveTransform();};
 function paint(){if(!supported){error.textContent='このテンプレートの描画コードが読み込まれていません。保存済みの編集内容は保持しています。ページを再読み込みしてください。';download.disabled=true;return;}const noPhoto=data.photoMode==='none';const provided=data.photoMode==='provided'||photoKinds[transform.index]==='provided';photoSelect.disabled=noPhoto;mode.disabled=provided||noPhoto;mode.value=provided?'contain':transform.mode;for(const key of ['zoom','x','y']){sliders[key].disabled=provided||noPhoto;sliders[key].value=provided?(key==='zoom'?1:0):transform[key];}canvas.style.touchAction=photos[transform.index]&&!provided&&!noPhoto?'none':'pan-y';let result;try{result=renderer.render(canvas,{...slide,title:typeof slide.title==='string'?slide.title:'',body:typeof slide.body==='string'?slide.body:'',...(ctaPanel?{ctaTitle:ctaTitleInput.value,ctaSubtitle:ctaSubtitleInput.value}:{})},i,design,logo,{bg:data.bg,ink:data.ink,font:data.font,fontFamily:loadedFonts.has(data.fontFamily||'standard')?(data.fontFamily||'standard'):'standard',photo:noPhoto?null:photos[transform.index],...transform,provided});}catch(renderError){download.disabled=true;error.textContent='プレビューの描画に失敗しました。文章・画像編集データは保持しています。再読み込みしてお試しください。';console.warn('プレビュー描画エラー',renderError);return;}error.textContent=result.ok?'':result.error;download.disabled=!result.ok;}
 title.oninput=()=>{slide.title=title.value;save();paint();};body.oninput=()=>{slide.body=body.value;save();paint();};
 download.onclick=async()=>{if(data.fontFamily&&!loadedFonts.has(data.fontFamily)){$('image-font-status').textContent='選択したフォントが未読込です。「フォントを再読み込み」を押してから保存してください。';$('retry-image-font').hidden=false;return;}await document.fonts.ready;paint();if(download.disabled)return;canvas.toBlob(blob=>{if(!blob){$('image-status').textContent='画像を保存できませんでした。もう一度お試しください。';return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`monomikke-${post.id}-${i+1}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);$('image-status').textContent='PNGをダウンロードしました。Chromeの「ダウンロード」またはFilesアプリで確認してください。';},'image/png');};card.append(label,title,body,alignment,...(ctaPanel?[ctaPanel]:[]),controls,canvas,error,download);$('image-fields').append(card);paint();});$('image-status').textContent=!photos.length&&data.slides.some(s=>s.photo?.index>=0)?'写真は保存されません。写真入りPNGを作るには写真を読み込み直してください。現在のプレビューは写真なしです。':'1080×1350px・3枚。編集した内容はこの投稿の履歴に保存されます。';
}
$('build-images').onclick=()=>{try{if(!requirePost())return;const renderer=globalThis.MonomikkeCarousel;if(!renderer?.themes?.[$('image-design').value]||typeof renderer.fromPost!=='function'){notice('選択したテンプレートのコードが読み込まれていません。再読み込みしてください。保存済みの文章・編集内容は保持しています。');return;}save();if(state()&&!confirm('画像内の編集を現在のInstagram文章で置き換えますか？'))return;post.carousel={photoMode:$('photo-kind').value,design:$('image-design').value,source:post.texts.instagram,slides:(post.purchaseSlides&&post.texts.instagram===post.generatedPurchaseSource?post.purchaseSlides:MonomikkeCarousel.fromPost(post.product?.name||post.theme,post.texts.instagram)).map((slide,i)=>({...slide,...(photos.length?{photo:{index:i%photos.length,zoom:1,x:0,y:0,mode:'contain'}}:{})}))};save();select(post,save);}catch(error){notice('画像編集を作成できませんでした。保存済みの文章・画像編集データは保持しています。再読み込みしてください。');console.warn('画像作成エラー',error);}};
$('image-design').onchange=()=>{if(!state())return;state().design=$('image-design').value;delete state().bg;delete state().ink;save();select(post,save);};
$('image-logo').onchange=async()=>{const file=$('image-logo').files[0];if(!file)return;try{const loaded=await MonomikkeImageLoader.load(file,{maxBytes:2*1024*1024,maxPixels:4096*4096});if(loaded.width>4096||loaded.height>4096){loaded.image.close();throw Error('ロゴは縦横4096px以下にしてください。');}logo?.close();logo=loaded.image;select(post,save);$('image-status').textContent='ロゴを反映しました。ロゴ画像はこの画面内のみ保持し、外部送信しません。';}catch(error){$('image-status').textContent=`ロゴ：${error.message}`;}};
$('clear-logo').onclick=()=>{logo?.close();logo=null;$('image-logo').value='';select(post,save);};
async function applyFont(key){
 if(key==='standard'){select(post,save);return;}
 failedFonts.delete(key);
 $('image-font-status').textContent='フォントを読み込んでいます…';
 const target=post;
 const ok=await ensureFont(key);
 if(post!==target||state()?.fontFamily!==key)return;
 select(post,save);
 if(ok){$('image-font-status').textContent='かわいいフォントを反映しました。PNG画像にも使用できます。';}
 else{$('retry-image-font').hidden=false;}
}
$('image-font-family').onchange=()=>{if(!requirePost()||!state())return;const selected=$('image-font-family').value;state().fontFamily=selected;save();applyFont(selected);};
$('retry-image-font').onclick=()=>{if(!requirePost()||!state())return;applyFont(state().fontFamily||'standard');};
for(const [id,key]of [['image-bg','bg'],['image-ink','ink'],['image-font','font']])$(id).onchange=()=>{if(!state())return;state()[key]=key==='font'?Number($(id).value):$(id).value;save();select(post,save);};
$('product-photos').onchange=async()=>{if(!requirePost()){$('product-photos').value='';return;}const files=Array.from($('product-photos').files);$('product-photos').value='';if(!files.length)return;if(!$('photo-rights').checked){$('image-status').textContent='利用権限の確認にチェックを入れてから選択してください。';return;}if(photos.length+files.length>6){$('image-status').textContent='写真は合計6枚までです。不要な写真を削除してください。';return;}
 const kind=$('photo-kind').value;if(kind==='none'){$('image-status').textContent='写真なしモードです。写真を使う場合はAまたはBを選んでください。';return;}
 if(state()&&(!Array.isArray(state().slides)||state().slides.length!==3||state().slides.some(slide=>!slide||typeof slide!=='object'))){notice('保存済みの画像編集形式を読み取れません。元データは保持しています。JSONをバックアップして確認してください。');return;}const target=post;const buttons=['product-photos','photo-kind','clear-photos','build-images'];buttons.forEach(id=>$(id).disabled=true);$('image-status').textContent='画像を読み込んでいます…';const loaded=[],errors=[];
 try{for(const file of files){try{loaded.push(await MonomikkeImageLoader.load(file));}catch(error){errors.push(`${file.name}：${error.message}`);}}if(post!==target){loaded.forEach(p=>p.image.close());$('image-status').textContent='編集中の投稿が変わったため、写真の反映を中止しました。もう一度選択してください。';return;}
 if(loaded.length){const first=photos.length;photos.push(...loaded.map(p=>p.image));photoNames.push(...loaded.map(p=>p.name));photoKinds.push(...loaded.map(()=>kind));ensureSlides();state().photoMode=kind;state().slides.forEach((slide,i)=>{if(i===0||!slide.photo||!photos[slide.photo.index])slide.photo={index:first+i%loaded.length,zoom:1,x:0,y:0,mode:'contain'};});save();select(post,save);}
 $('image-status').textContent=[loaded.length?`写真${photos.length}枚を端末内に読み込みました。今回の写真を1枚目のプレビューに反映しました。写真は再読み込みで消えます。`:'読み込める画像がありませんでした。',...errors].join('\n');
 }finally{buttons.forEach(id=>$(id).disabled=false);$('product-photos').disabled=$('photo-kind').value==='none';}
};
$('clear-photos').onclick=()=>{photos.forEach(p=>p.close());photos=[];photoKinds=[];photoNames=[];gallery();if(state())state().slides.forEach(slide=>delete slide.photo);save();select(post,save);$('image-status').textContent='写真をすべて削除しました。';};
$('photo-kind').onchange=()=>{$('product-photos').disabled=$('photo-kind').value==='none';if(state()){state().photoMode=$('photo-kind').value;save();select(post,save);}};
window.MonomikkeCarouselUI={select,changed(){if(state())$('image-stale').textContent=state().source!==post.texts.instagram?'元のInstagram文章が変更されています。画像は自動で上書きしません。必要なら作り直してください。':'';}};
})();
