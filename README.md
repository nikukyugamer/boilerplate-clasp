# Google Apps Script で一般的にやっておいたほうがいいこと
- `appsscript.json` を見えるようにしておくこと

[![Image from Gyazo](https://i.gyazo.com/e890e15b4bea0ce95023bf5d238514ab.png)](https://gyazo.com/e890e15b4bea0ce95023bf5d238514ab)

# Clasp ボイラープレート
- まずは `$ yarn install` する
- すでに `.clasprc.json` が存在する場合（パターン A）とそうでない場合（バターン B）により、手順が分かれる

## A. すでに `.clasprc.json` が存在する場合
- 一般論として `~/.clasprc.json` をそのまま放置しておくと上書きリスク等があるので、適宜リネームしておいた方がいい
  - 個人的なリネーム規則は `~/.clasprc.json` を `~/.clasprc.foo@example.com.json` である

## A-1. `.clasprc.json` をプロジェクトルートに置く
- 使いたい `.clasprc.json` をプロジェクトルートに置く
  - `.gitignore` に登録済み

## B. `.clasprc.json` を初めて作成する場合

## B-1. $ npx clasp login
Google アカウントにてログインをして、Clasp 用の権限ファイルを得る。すでに存在する場合は上書きされてしまうので注意する。

```bash
$ npx clasp login
```

これにより、`~/.clasprc.json` が作成される。

## B-2. `.clasprc.json` をプロジェクトルートに置く
- `.clasprc.json` をプロジェクトルートに置く
  - `.gitignore` に登録済み

## C. 以下は A. と B. で共通（Webアプリの場合はここでなく D. へ）

## C-1. $ npx clasp clone
既存のプロジェクトを持ってくるために `$ npx clasp clone` する。

なお、スプレッドシート の新規作成や App Script の新規作成を行うには `$ npx clasp create` を実行する。ただし、実際はほとんどやる機会はないと思う。

```bash
$ npx clasp clone スクリプトID
```

`npx clasp` を実行すると以下の 2つ のファイルが作成される。これらのファイルは触る必要はない。

- `.clasp.json`
- `appsscript.json`

「スクリプトID」はスプレッドシートの URL から取得できる。

## C-2. スクリプトの拡張子を .ts に統一する
- `.js` と `.ts` の拡張子が混在している時は `.js` は `$ npx clasp push` の対象外になる
- `.ts` に統一する

## C-3. .claspignore を設定する
- `.claspignore` に必要に応じて追記する
  - Webページを公開しないならば `src/` 配下は不要
- 併せてファイル自体も削除する

## C-5. package.json を編集する
- `name`
- `repository`

## C-5. $ npx clasp push してみる
- 適当にコードを変えて `$ npx clasp push` してみる
  - Webのエディタ側で確認し、変更が反映されていれば OK
- `Google Apps Script API` が「オフ」になっているとエラーになる
  - https://script.google.com/home/usersettings に行って「ON」にする

## C-6. 安定したらこの README は削除 or 移動して本来の README を書く
- 開発サイクルが安定したらこの README を本来の README に取り替える

# D. Webアプリ（Webサイト）として表示したい場合
以下は Vite + React の場合であり、他のフレームワークやライブラリを用いる場合は変更が必要になる。

## D-1. .clasp.json を編集する
- `rootDir` を `dist` に変更する

```json
  "rootDir": "/path/to/repo/dist"
```

## D-2. 環境変数 CLASP_DEPLOYMENT_ID を定義する
- `package.json` 内の `scripts` で用いるため

## D-3. .claspignore を設定する
- `.claspignore` に必要に応じて追記する
  - スプレッドシート用などならば `lib/` 配下は不要
- 併せてファイル自体も削除する

## D-4. package.json を編集する
- `name`
- `repository`

## D-5. appscript.json を dist/ に移動する
- 更新があった場合には dist/ に毎回移動する必要がある

## D-6. 開発する
- あとは普通に開発する
- `src/doGet.js` が Apps 側のエントリポイントになる
- Apps 側の `index.html` は `dist/index.html` が常にビルドされるので考慮不要

## D-7. 安定したらこの README は削除 or 移動して本来の README を書く
- 開発サイクルが安定したらこの README を本来の README に取り替える

# 注意点など

## 複数ファイルではコード実行の順番依存がある
- 順番によっては undefined をレシーバにしてしまうことが起きうる
  - https://zenn.dev/tacck/articles/20211218_gas
  - `.clasp.json` に `filePushOrder` というプロパティで設定することはできるが継続的メンテが大変に面倒
  - ここは人間が「考えながら」作るしかない
    - ファイル名やディレクトリ名を工夫する

## import / export は使えない
- npm を使うときは `require` を使うこと
- 他のファイルの内容を読み込みたい場合には `namespace` を使うこと（後述）

## 開発時はみんなが Clasp を使うこと
- Clasp を用いるプロジェクトではみんな Clasp を使うこと
  - Apps 側 はいわばデプロイ場所なので、手でいじるところではない

## 複数ファイルを用いて import / export 的なことをする場合にはどうしたらいいか？
- [ソース分割について](/DIVIDE_CODES.md)

## ローカルのルートディレクトリには余計なファイルが多く存在することになる lib/ とか src/ とかにスクリプト本体を入れるとよい
- 実行は `_main_.ts` 経由で行う
  - ファイル名の最初と最後にアンダースコアを入れるのは以下の理由による
    - 開発環境上の「並び」で一番上に来るから
    - GAS上の「並び」で一番上に来るから
    - 最初だけにアンダースコアを入れると未使用ファイル的な印象を与えてしまうから最後にも入れる
  - 実態はすべて `lib/` とか `src/` とかに入れる

## ログ出力の方法
- `Logger.log('foobar')`
  - `console.log('foobar')` よりも `Logger` が推奨されている

## 変更を検知して自動で push をさせる方法
たまにうまくいかないことがあるので、毎回 push するのが確実ではある。

```bash
$ npx clasp push --watch
```

## Webコンソールをリロードしなくても clasp push は反映されているか？
- されている
- 同じメソッドの実行を繰り返しながら開発しているようなときは、わざわざリロードしなくていい
  - `$ npx clasp push --watch` を実行させながらトライアンドエラーをサクサク繰り返せる

## package.json の "scripts" をうまく使う
- 例えば `.clasprc.json` や `.clasp.json` を使い分けるとき
  - `package.json` の `scripts` プロパティに実行オプションの記述を押し込んで、`npm` や `yarn` コマンド経由で簡潔に実行できると楽
- あまりにごちゃごちゃするようならばシェルスクリプトでもよい

## 最新の API の型ファイル（の中身）はない
- 例えば `AnalyticsData` とかの型
- 仕方ないので直前の行に `// @ts-ignore` と書いて赤い波線が引かれないようにする

## テストは（ほぼ）書けない
- 場合によってはガリガリの手動で書くことはできる
- TypeScript の範囲で担保するのが現実的
- 実挙動に関しても、現実的にはトライアンドエラーを高速に回すプリントデバッグがいい
  - それで辛い場合はそもそも GAS の範疇を超えている可能性が高い
- ただし Webアプリ の場合はそもそも独立しているので可能

## .clasprc.json や .clasp.json を使い分ける方法
- clasp コマンド ではオプションを指定することで `.clasprc.json` や `.clasp.json` を変更できる
  - 複数アカウントや複数プロジェクトを扱うことも可能
    - Clasp の仕様上、複数のディレクトリを作ってプロジェクトを分けることになる

```bash
$ npx clasp --help
Usage: clasp <command> [options]

clasp - The Apps Script CLI

Options:
  -v, --version                               output the current version
  -A, --auth <file>                           path to an auth file or a folder with a '.clasprc.json' file.
  -I, --ignore <file>                         path to an ignore file or a folder with a '.claspignore' file.
  -P, --project <file>                        path to a project file or to a folder with a '.clasp.json' file.
  -h, --help                                  display help for command
```
