(function(root){
// General guidance only: no inferred product specifications, prices or compatibility.
const knowledge=[
{id:'android-font',category:'tips',aliases:['androidの文字サイズ','androidの文字を大きく','androidの文字サイズ変更'],title:'Androidの文字サイズを変更',facts:['設定アプリで「文字サイズ」を検索し、文字サイズの項目を開く。','スライダーを動かし、プレビューを見ながら読みやすい大きさに調整する。'],benefit:'文字の読みやすさを自分に合わせて調整できる。',caution:'項目名や場所は機種・Androidのバージョンで異なり、一部のアプリには反映されない場合があります。',source:'https://support.google.com/accessibility/android/answer/6006972?hl=ja'},
{id:'iphone-font',category:'tips',aliases:['iphoneの文字サイズ','iphoneの文字を大きく','iphoneの文字サイズ変更'],title:'iPhoneの文字サイズを変更',facts:['「設定」→「画面表示と明るさ」→「テキストサイズを変更」を開く。','スライダーで文字サイズを調整する。さらに大きくする場合は「アクセシビリティ」→「画面表示とテキストサイズ」→「さらに大きな文字」を確認する。'],benefit:'対応アプリの文字を読みやすく調整できる。',caution:'すべてのアプリが同じ文字サイズに対応するわけではありません。OSにより表示が異なる場合があります。',source:'https://support.apple.com/ja-jp/102453'},
{id:'android-notifications',category:'tips',aliases:['androidの通知を減らす','androidの通知設定'],title:'Androidの通知を整理',facts:['設定アプリの「通知」→「アプリの通知」で、対象アプリを探す。','必要な通知を確認してから、不要な通知をオフにする。'],benefit:'通知の多いアプリを個別に見直せる。',caution:'機種によって項目名が異なります。通知を切ると大切な連絡も見逃す場合があるため、必要なアプリは残してください。',source:'https://support.google.com/android/answer/9079661?hl=ja'},
{id:'stand',category:'phone',aliases:['スマホスタンド','折りたたみスマホスタンド'],title:'スマホスタンドの選び方',facts:['スマホケースを付けた状態で、受け部分の幅・厚みと合うか確認。','充電しながら使うなら、端子とケーブルが台座に当たらないか確認。'],benefit:'机の上で画面を見る用途なら、手で持ち続けずに使える。',caution:'角度調整や折りたたみの有無は製品ごとに違います。サイズや安定性は商品情報で確認してください。'},
{id:'battery',category:'phone',aliases:['モバイルバッテリー','スマホ充電バッテリー'],title:'モバイルバッテリーの選び方',facts:['スマホの端子に合うケーブルと、バッテリー側の出力端子を確認。','持ち歩く時間に合わせて、容量だけでなく重さ・大きさも比較。'],benefit:'対応する機器なら、コンセントのない場所でも充電できる。',caution:'容量表示から充電回数は断定できません。急速充電の対応条件や航空会社の持ち込み規定は個別に確認してください。'},
{id:'storage',category:'life',aliases:['収納ボックス','収納ケース'],title:'収納ボックスを選ぶ前に',facts:['置き場所の幅・奥行き・高さと、扉や引き出しを動かす余白を測る。','入れる物の大きさと、取り出す頻度からフタや持ち手の使いやすさを比較。'],benefit:'置き場所と中身の両方に合う収納を選びやすくなる。',caution:'外寸と内寸は違います。積み重ねや耐荷重、洗えるかどうかは各製品の表示を確認してください。'},
{id:'cable',category:'life',aliases:['ケーブルクリップ','コードクリップ'],title:'ケーブルクリップの選び方',facts:['留めたいケーブルの太さと、クリップの対応サイズを照合。','貼り付け式は、設置面の素材や凹凸に対応するか確認。'],benefit:'机の上でケーブルの定位置を作る用途に使える。',caution:'粘着力や剥がしやすさは製品と設置面によります。賃貸の壁や家具では跡や塗装剥がれにも注意してください。'},
{id:'acrylic',category:'oshi',aliases:['アクスタケース','アクリルスタンドケース'],title:'アクスタケースの選び方',facts:['アクスタ本体・台座それぞれの寸法と、ケースの内寸を比較。','持ち歩くなら、内側で動かない収納方法と開閉部分を確認。'],benefit:'本体と台座をまとめて持ち歩く用途に使える。',caution:'クッションや防水性能の有無は商品情報で確認してください。収納できても傷や破損を完全に防げるとは限りません。'},
{id:'fan',category:'oshi',aliases:['うちわケース','うちわカバー'],title:'うちわケースの選び方',facts:['うちわの横幅・高さ・持ち手と、ケースの対応寸法を照合。','バッグへ入れる場合は、ケースを含めた大きさでも収まるか確認。'],benefit:'うちわをまとめて収納・持ち運びする用途に使える。',caution:'折れや水濡れへの強さは素材により違います。会場での使用・持ち込みルールも確認してください。'}
];
root.MonomikkeKnowledge=knowledge;if(typeof module!=='undefined')module.exports=knowledge;
})(globalThis);
