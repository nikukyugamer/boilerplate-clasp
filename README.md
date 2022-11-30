# Clasp ボイラープレート

## 1. $ clasp login
Google アカウントにてログインをして、Clasp 用の権限を得る。

```bash
$ clasp login
```

これにより、`~/.clasprc.json` が作成される。

## 2. $ clasp clone
既存のプロジェクトを持ってくるために `$ clasp clone` する。

なお、スプレッドシート の新規作成や App Script の新規作成を行うには `$ clasp create` を実行する（実際はほとんどやる機会はないと思う）。

```bash
$ clasp clone スクリプトID
```

このコマンドを実行すると以下の 2つ のファイルが作成される。

- `.clasp.json`
- `appsscript.json`

「スクリプトID」はスプレッドシートの URL から取得できる。

## 3. 得られた 2つ のファイルの取り扱いについて
- `.clasp.json` は `.gitignore` する
  - 開発者ごとの情報が入るし、秘匿情報も入るから
- `appscript.json` は触る必要はない

## 4. スクリプトの拡張子を .ts に統一する
- `.js` と `.ts` の拡張子が混在している時は `.js` は `$ clasp push` の対象外になる
- `.ts` に統一する

## 5. tsconfig.json を追加
公式ドキュメントどおりに最低限の `tsconfig.json` を追加する。

```json
{
  "compilerOptions": {
    "lib": ["esnext"],
    "experimentalDecorators": true
  }
}
```

## 6. .claspignore を設定する
- `.claspignore` を必要に応じて設定する。
- ホワイトリスト形式なので、サブディレクトリを新たに作った際には `.claspignore` に追記する必要がある

## 7. $ clasp push してみる
- 適当にコードを変えて `$ clasp push` してみる
  - Webページ側で確認し、変更が反映されていれば OK
- `Google Apps Script API` が「オフ」になっているとエラーになる
  - https://script.google.com/home/usersettings に行って「ON」にする

# 注意点など

## みんな Clasp を使うこと
- Clasp を用いるプロジェクトではみんな Clasp を使うこと

## ルートは余計なファイルが入るので lib/ にスクリプトを入れるとよい
- 実行は `_main_.ts` 経由で行う
  - ファイル名の最初と最後にアンダースコアを入れるのは以下の理由による
    - 開発環境上の「並び」で一番上に来るから
    - GAS上の「並び」で一番上に来るから
    - 最初だけにアンダースコアを入れると未使用ファイル的な印象を与えてしまうから最後にも入れる
  - 実態はすべて `lib/` に入れる

## .clasprc.json や .clasp.json を使い分ける方法
- clasp コマンド ではオプションを指定することで `.clasprc.json` や `.clasp.json` を変更できる
  - 複数アカウントや複数プロジェクトを扱うことも可能
    - Clasp の仕様上、複数のディレクトリを作ってプロジェクトを分けることになる

```bash
$ clasp --help
Usage: clasp <command> [options]

clasp - The Apps Script CLI

Options:
  -v, --version                               output the current version
  -A, --auth <file>                           path to an auth file or a folder with a '.clasprc.json' file.
  -I, --ignore <file>                         path to an ignore file or a folder with a '.claspignore' file.
  -P, --project <file>                        path to a project file or to a folder with a '.clasp.json' file.
  -h, --help                                  display help for command
```

## 複数ファイルを用いて import / export 的なことをする場合にはどうしたらいいか？
- 全体を `namespace Hogehoge {}` でくくる
  - メソッドや変数の定義の前に `export` を付与する
- 呼び出す側は接頭語（レシーバ）に `Hogehoge` を指定する
  - 階層フォルダ構造も取ることができる
    - Webコンソール上のファイル名は、スラッシュが単なる文字となって平たくなる
  - 関数名や変数名の名前は完全にグローバルなので衝突に注意する
    - つまり、階層構造にしたとしても単に「見た目」が変わるだけ
- 具体例は以下のとおり

```typescript:Foo.ts
namespace Foo {
  export const greeting = () => {
    Logger.log('Hello, World!')
  }
}
```

```typescript:bar.ts
function bar() {
  Foo.greeting()
}
```

## ログ出力の方法
- `Logger.log('foobar')`

## 変更を検知して自動で push をさせる方法

```bash
$ clasp push --watch
```

## Webコンソールをリロードしなくても clasp push は反映されているか？
- されている
- 同じメソッドの実行を繰り返しながら開発しているようなときは、わざわざリロードしなくていい
  - `$ clasp push --watch` を実行させながらトライアンドエラーをサクサク繰り返せる

## package.json の "scripts" をうまく使う
- 例えば `.clasprc.json` や `.clasp.json` を使い分けるとき
  - `package.json` の `scripts` プロパティに実行オプションの記述を押し込んで、`npm` や `yarn` コマンド経由で簡潔に実行できると楽
- あまりにごちゃごちゃするようならばシェルスクリプトでもよい

## 最新の API の型ファイル（の中身）はない
- 例えば `AnalyticsData` とかの型
- 仕方ないので直前の行に `// @ts-ignore` と書いて赤い波線が引かれないようにする

## テストは書けない
- 場合によってはガリガリの手動で書くことはできる
- 現実的には、トライアンドエラーを高速に回すプリントデバッグがいい
