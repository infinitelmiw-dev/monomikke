(function(root){
const topics={notice:['投稿テーマの募集方針','今週の投稿予定のお知らせ','新しいカテゴリーのご案内','プロフィール更新のお知らせ','リンク掲載場所のご案内','投稿の訂正について','更新予定のご案内','お休み予定のお知らせ','商品の情報確認について','投稿の見方のご案内','保存機能の使い方のご案内','画像投稿のご案内','お問い合わせ方法のご案内','広告表示についてのお知らせ','今後紹介したいテーマ'],
tips:['スマホの充電を長持ちさせる方法','スマホの容量不足','スマホのバックアップ','スマホのアップデート','アプリの権限を見直す','位置情報の設定','通信量を減らす','テザリングの使い方','Wi-Fiにつながらない','Bluetoothがつながらない','スクリーンショットの撮り方','QRコードを読み取る','スマホの文字を大きくする','ロック画面の通知を隠す','迷惑メール対策','写真を共有する前の注意','スマホが熱い','二段階認証'],
phone:['スマホスタンドの選び方','モバイルバッテリーを選ぶときの確認点','スマホケースと充電端子の相性確認','充電ケーブルの長さを選ぶ','スマホストラップの取り付け確認','画面保護フィルムのサイズ確認','車載スマホホルダーの設置場所','スマホ用防水ケースの使用条件','卓上充電器の設置スペース','スマホポーチの内寸確認','ケーブル収納ポーチを整理する','スマホリングとケースの相性','タブレット兼用スタンドの対応寸法','イヤホンケースの持ち歩き方','充電アダプターの対応規格確認','スマホ撮影用三脚の固定方法'],
life:['収納ボックスの選び方','ケーブルクリップの選び方','キッチン引き出しの仕切りを選ぶ','洗面台の収納スペースを測る','掃除道具の置き場所を決める','玄関の小物トレーを選ぶ','折りたたみ買い物バッグの選び方','冷蔵庫の整理ケースを選ぶ','詰め替えボトルの表示を整理する','洗濯ネットのサイズを選ぶ','吊り下げ収納の耐荷重確認','マグネット収納の取り付け面確認','食品保存容器の使用条件確認','デスクの小物整理を見直す','旅行用ポーチの仕分け方','掃除用ブラシのお手入れ確認'],
oshi:['アクスタケースの選び方','うちわケースの選び方','トレカケースの内寸確認','缶バッジ収納の選び方','ペンライトの持ち運びと会場ルール','ライブ用バッグのサイズ確認','推し活ポーチの中身を整理する','グッズ保管場所の日差し対策','チケットホルダーを選ぶ','アクスタ撮影用台座の安定確認','キーホルダー金具の取り付け確認','遠征用グッズ持ち物リスト','ぬいぐるみポーチのサイズ確認','ブロマイド収納の選び方','グッズ交換用梱包材の準備','推し活収納ボックスを整理する']
};
// Shuffle bags are stored separately from posts. Exclude the last batch on refill.
function suggest(category,state={},random=Math.random){
 const pool=topics[category];if(!pool)throw Error('カテゴリーを確認してください。');
 const old=state[category]||{};const seen=new Set();let bag=(Array.isArray(old.bag)?old.bag:[]).filter(x=>pool.includes(x)&&!seen.has(x)&&seen.add(x));
 const last=Array.isArray(old.last)?old.last:[];
 const selected=[];
 while(selected.length<3){if(!bag.length){bag=pool.filter(x=>!last.includes(x)&&!selected.includes(x));for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}}const pick=bag.shift();if(!selected.includes(pick))selected.push(pick);}
 return {topics:selected,state:{...state,[category]:{bag,last:selected}}};
}
const api={topics,suggest};root.MonomikkeTopics=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
