(function (root) {
  const categories = {
    tips: {name:'スマホ豆知識', icon:'▤', lead:'いつものスマホに、小さな発見。', question:'スマホの使い方、見直してみない？', tags:'#スマホ豆知識 #スマホ活用', check:'設定方法は機種やOSによって異なるので、自分のスマホで確認してみてね。'},
    phone: {name:'スマホ便利グッズ', icon:'▯', lead:'スマホ時間を、もう少し心地よく。', question:'スマホまわり、もっと使いやすくしたいよね。', tags:'#スマホ便利グッズ #ガジェット', check:'購入前に、対応機種やサイズをチェックしてね。'},
    life: {name:'暮らしの便利グッズ', icon:'⌂', lead:'暮らしの中の「ちょっと困った」に。', question:'毎日の小さな手間、少し減らせたらうれしい。', tags:'#暮らしの便利グッズ #暮らしを整える', check:'使う場所のサイズやお手入れ方法も確認してね。'},
    oshi: {name:'推し活グッズ', icon:'♡', lead:'大好きな推しと、もっと楽しい毎日を。', question:'推し活の準備を考える時間も、楽しいよね。', tags:'#推し活グッズ #推しのいる生活', check:'会場で使う場合は、持ち込みや使用ルールもチェックしてね。'}
  };
  function generate(category, theme, details='') {
    const c=categories[category];
    theme=theme.trim(); details=details.trim();
    if(!c || !theme || theme.length>100 || details.length>300) throw new Error('カテゴリーと100文字以内のテーマ、300文字以内のポイントを確認してください。');
    const points=details ? `注目ポイントはこちら。\n${details}` : '気になる使い方や、自分の暮らしに合うポイントを見つけてみてね。';
    const instagram=`${c.lead}\n\n今日のモノみっけ！は\n「${theme}」 ✨\n\n${points}\n\n${c.check}\n\nあとで見返せるように保存してね 📌\nみんなが気になるポイントも、コメントで教えて！\n\n#モノみっけ ${c.tags} #便利な暮らし`;
    const threadPoints=details ? `\n\n${details}` : '';
    let threads=`${c.question}\n\n今日気になったのは「${theme}」。${threadPoints}\n\n${c.check}\n\nみんなはどんなふうに使いたい？\n#モノみっけ`;
    // Keep the prototype's Threads draft below 500 Unicode code points.
    if(Array.from(threads).length>500) threads=`「${theme}」が気になる！${threadPoints}\n\n${c.check}\n\nみんなはどう使いたい？\n#モノみっけ`;
    return {instagram,threads};
  }
  root.Monomikke={categories,generate};
  if(typeof module!=='undefined') module.exports={categories,generate};
})(globalThis);
