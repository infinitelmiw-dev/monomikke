# 簡単投稿が公開サイトに表示されない場合

## 2026-11-11（日本時間）の調査

- main `50237c983fbbc2b2b690d5b12ce6c2f203c96111` の index.html は easy-post.js → easy-ui.js を依存スクリプトの後に defer で読み込む。簡単投稿欄も初期表示される。
- 公開URLのHTMLは、最後にデプロイ成功した #21 のコミット `3a6c430e747e32e79b70ddc3e069dc1453b2783b` の index.html とバイト単位で一致した。Service Workerを使わないHTTP取得でも旧版だったため、主因は未デプロイ。
- [Pages #22](https://github.com/infinitelmiw-dev/monomikke/actions/runs/42672465500) は調査時点で queued、ジョブ0件。リポジトリに独自のActionsワークフローはなく、GitHub管理の `dynamic/pages/pages-build-deployment` が使用されている。ユーザー申告の内部サーバーエラー自体のログは取得できず、現状の情報からコードのビルドエラーとは判断できない。ジョブ開始前の滞留はGitHub側の処理の問題と考えられる。
- 旧Service Workerはネットワーク優先なので、オンラインで必ず旧画面を返す実装ではない。ただし固定v1キャッシュを更新せず、簡単投稿・ブランド用JSが対象外で、HTMLのクエリ付きJS/CSS URLとも一致していなかった。オフライン復帰で古いHTMLや読み込み失敗が起こり得る。

## 修正と検証

Service Workerのキャッシュを更新し、HTMLと同じバージョン付きURLで簡単投稿の依存ファイルを保存する。通信成功時にオフライン用コピーも更新する。古いアプリキャッシュだけを削除し、localStorageの履歴・商品、他アプリのキャッシュは維持する。配布ZIPにも既存HTMLが参照するmanifest・アイコン・Service Workerを含める。

検証コマンド（ブラウザテストはPlaywrightとChromiumが必要）:

```sh
npm test
node tests/browser/easy-flow.cjs
node tests/browser/editor-recovery.cjs
node tests/browser/service-worker.cjs
python3 scripts/package-pages.py
```

追加のService Workerテストは /monomikke/ 配下でv1からの更新、スマホ幅、オフライン再読み込み、簡単投稿用JS、保存済み投稿・商品・localStorageおよび他キャッシュの保持を確認する。

## スマホから公開へ反映する手順

1. この修正PRを確認し、利用者がmainへマージする。
2. GitHubリポジトリの Actions → 最新の pages build and deployment がmainの最新コミットで成功するまで確認する。
3. 古い #22 がQueuedのままなら、その実行詳細から Cancel workflow が表示される場合にキャンセルし、最新の実行を確認する。再実行ボタンが使える場合は最新コミットの実行で Re-run all jobs を選ぶ。連続再実行は避ける。
4. ジョブが作成されない状態やInternal Server Errorが続く場合は https://www.githubstatus.com/ のActions/Pagesを確認し、復旧後に再実行する。継続する場合は実行URLとコミットSHAを添えてGitHub Supportへ問い合わせる。アプリコードの変更だけではGitHub内部のキューは直せない。
5. 成功後、公開URLをオンラインで開き直す。画面上部に「かんたん投稿作成」が出ることを確認する。必要なら一度再読み込みし、ホーム画面アプリも閉じて開き直す。

**ブラウザのサイトデータ・ストレージは削除しない。** 投稿履歴・登録商品は端末のブラウザ内にある。作業前に「楽天アフィリエイト商品管理」のJSONバックアップを保存すると安心。キャッシュ更新はこれらのデータを削除しない。SNS公開は利用者が確認して手動で行う。
