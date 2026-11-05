# Androidだけで「モノみっけ！」を公開する

PC・APIキー・有料契約は不要です。AndroidのChrome、GitHubアカウント、インターネット接続を使います。無料のGitHub Pagesで、公開リポジトリのファイルをHTTPS配信します。

作業は「ファイルをGitHubに保存」→「Pagesを有効化」→「表示されたURLを開く」の順です。クラウド環境の公開とは別の操作です。このリポジトリのファイルは、作成しただけではGitHubにアップロードされません。

## ZIPなし・Pull Requestから公開する（今回はこちら）

コードがGitHubの作業ブランチに反映済みの場合、ファイルのダウンロードやアップロードは不要です。

1. AndroidのChromeでGitHubにログインします。
2. このチャットで案内したPull Requestのリンクを開きます。PRがない場合は、リポジトリの「Pull requests」→「New pull request」で base: `main`、compare: `feat/monomikke-post-studio` を選び、「Create pull request」をタップします。
3. 「Files changed」で変更を確認します。
4. 「Conversation」に戻り、「Merge pull request」→「Confirm merge」をタップします。ボタンが見えなければChromeの「︙」→「PC版サイト」を使ってください。権限やブランチ保護でマージできない場合は、表示された条件の対応が必要です。
5. 以下の「手順5. GitHub Pagesを有効にする」へ進みます。手順1〜4のファイル準備・アップロードは不要です。
6. mainへのマージ後にPagesの設定を行ってください。Pagesで公開するのは作業ブランチではなくmainです。

## 1. 手動アップロード用のファイル準備（通常は不要）

Pull Requestを使う場合は、この手順をスキップします。手動でアップロードする場合のみ、`index.html`、`style.css`、`generator.js`、`app.js` を用意してください。4ファイルは同じ階層に置きます。`.nojekyll` はビルドをせず静的ファイルを配信するための空ファイルです。この構成では、表示されなければ4ファイルだけでも動きます。

## 2. GitHubにログインする

1. Chromeで https://github.com を開きます。
2. アカウントがあれば「Sign in」、なければ「Sign up」から登録します。
3. Chromeの右上「︙」で「PC版サイト」にチェックを入れます。GitHubの設定項目が見つからないときに便利です。小さい文字は指で拡大できます。

## 3. 保存先のリポジトリを開く

既存の保存先を使う場合：

1. https://github.com/infinitelmiw-dev/monomikke を開きます。
2. 自分に編集権限があることを確認します。「Settings」が見えない場合、管理権限が不足している可能性があります。
3. 無料プランでは、Pages用に **Public（公開）** のリポジトリを使います。既存リポジトリがPrivateで、公開したくないファイルを含む場合は、公開設定を変更せず、下の方法で別の公開リポジトリを作ってください。

別の保存先を作る場合：

1. https://github.com/new を開きます。
2. 「Repository name」に `monomikke-web` と入力します。
3. 「Public」を選びます。この場所に保存したソースコードとサイトは誰でも閲覧できます。
4. 「Add a README file」を有効にし、「Create repository」をタップします。

以後の操作は選んだリポジトリで行います。APIキーや個人情報をファイルとしてアップロードする必要はありません。

## 4. アプリをGitHubにアップロードする

1. リポジトリの「Code」画面を開き、ブランチを `main` にします。
2. ファイル一覧の上にある「Add file」→「Upload files」をタップします。新規の空リポジトリでは「uploading an existing file」からも進めます。
3. 「choose your files」をタップします。Androidのファイル選択画面で、ファイルを保存したフォルダーを開きます。
4. `index.html`、`style.css`、`generator.js`、`app.js` を選択します。複数選べなければ、アップロード・保存を繰り返して1つずつ追加できます。`.nojekyll` が見える場合は一緒に追加します。
5. 保存先がリポジトリの一番上であることを確認します。4ファイルを別のフォルダーに入れないでください。
6. 「Commit changes」の説明に `Publish Monomikke prototype` と入力します。
7. `Commit directly to the main branch` を選び、「Commit changes」をタップします。ブランチ保護で直接保存できない場合は、新しいブランチとPull requestを作り、管理者がマージする必要があります。
8. 「Code」画面で、READMEと同じ階層に4ファイルが並んでいることを確認します。既存の同名ファイルを更新するときは、新しい内容に置き換わります。

既にこの4ファイルがGitHubのmainに保存されている場合は、再アップロードせず次へ進めます。

## 5. GitHub Pagesを有効にする

1. リポジトリ上部の「Settings」を開きます。画面幅によっては「…」の中にあります。
2. 左側メニューの「Code and automation」内の「Pages」を開きます。
3. 「Build and deployment」の「Source」で **Deploy from a branch** を選びます。
4. 「Branch」で **main** を選びます。
5. 隣のフォルダーで **/ (root)** を選びます。
6. 「Save」をタップします。ビルドコマンドや環境変数、APIキーの設定は不要です。
7. 数分待ってページを再読み込みします。「Your site is live at …」または「Visit site」が出たら、そのURLを開きます。「Actions」タブの `pages build and deployment` でも処理結果を確認できます。
8. 「Enforce HTTPS」が選べる場合は有効にします。アクセスには必ず `https://` のURLを使います。

既存リポジトリ `infinitelmiw-dev/monomikke` の場合、標準の公開URLは次の形です（カスタムドメインなどがある場合はPages画面のURLを優先してください）。

https://infinitelmiw-dev.github.io/monomikke/

新しく `monomikke-web` を作った場合は `https://自分のGitHubユーザー名.github.io/monomikke-web/` です。設定とデプロイが完了するまではアクセスできません。

## 6. スマホで動作を確認する

1. 表示された公開URLをChromeの通常タブで開きます。
2. カテゴリーを選び、テーマに「旅行に持っていきたいスマホスタンド」と入力します。
3. 「投稿文を生成する」をタップします。
4. InstagramとThreadsを切り替え、別々の文章が表示されることを確認します。
5. 「コピー」をタップし、メモアプリなどに貼り付けて確認します。
6. ステータスを「投稿準備OK」に変更します。
7. ページを再読み込みして「投稿履歴」を開き、投稿とステータスが残っていることを確認します。
8. 「開く・編集」から文章を修正し、再度履歴から開いて変更が残ることを確認します。

## 7. ホーム画面から使う

Chromeで公開URLを開いた状態で「︙」→「ホーム画面に追加」→「ショートカットを作成」（表記は機種により異なります）を選びます。名前を「モノみっけ！」にして追加すると、ホーム画面から開けます。これはWebサイトへのショートカットです。初回表示・再読み込みには通信を使います。

## 履歴について

- 投稿作成・コピー・履歴・ステータス管理は公開後も同じように動きます。
- 履歴はそのスマホの、そのブラウザのlocalStorageに保存されます。GitHubや他の利用者に投稿履歴がアップロードされることはありません。
- 以前のlocalhostやプレビューで保存した履歴は、新しい公開URLに自動移行されません。大切な文章は元の画面でコピーして保管してください。
- Chromeと他のブラウザ、別スマホ、シークレットタブでは履歴を共有しません。ブラウザのサイトデータ削除でも消えます。
- 同じ公開URLでアプリのファイルだけを更新すれば、通常は履歴が維持されます。URL・ドメイン・保存形式を変える場合は別途移行が必要です。
- GitHub Pagesはアプリ自体を公開するサービスです。ログインによる利用制限は、この試作品にはありません。

## 困ったとき

| 状況 | 確認すること |
| --- | --- |
| Pages設定が見つからない | ChromeのPC版サイトを使用し、管理権限とリポジトリの公開状態を確認 |
| 404になる | Pagesのmain / (root)、index.htmlの位置、Actionsの成功を確認。初回は数分待つ |
| READMEだけ表示される | index.htmlがmainの一番上に保存されているか確認 |
| 色がなく、生成ボタンも動かない | CSSと2つのJSをindex.htmlと同じ階層へアップロード。ファイル名の大文字・小文字も一致させる |
| 更新が反映されない | Actions完了後にページを再読み込み。履歴が消えるので、サイトデータの削除は安易に行わない |
| コピーできない | HTTPSで開く。文章欄を長押しし「すべて選択」→「コピー」でも利用可能 |
| 履歴が保存できない | 通常タブを使用し、Chromeの保存設定・端末の空き容量を確認 |

GitHub公式ヘルプ：https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
