(function(root){
const queries={tips:'スマホ 便利グッズ',phone:'スマホ 便利グッズ',life:'暮らし 便利グッズ',oshi:'推し活 グッズ',notice:'便利グッズ'};
function searchUrl(category,keyword=''){const q=keyword.trim()||queries[category];if(!q)throw Error('カテゴリーを選んでください。');return `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(q)}/`;}
function dateJst(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
const api={searchUrl,dateJst};root.MonomikkeEasy=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
