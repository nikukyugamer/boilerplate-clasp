# ソース分割について
- [Modules, exports and imports](https://github.com/google/clasp/blob/master/docs/typescript.md#modules-exports-and-imports)
  - `export` や `import` (ESM) は使えない
  - 以下の 3つ の手法が提案されている（書かれた日付は古い）
    - `exports` を使う
    - `namespace` を使う
    - `webpack` やその他ビルドツールを使う

# どうすればいいか
- 2022/12/29 現在では `namespace` が一番安心して使って良さそうなので、これを使う

# 具体的にどう使うか
- 使いたいオブジェクトなりに `namespace` を被せて名前空間を分ける
  - GAS はどこでどうソースコードを書こうとも、原則グローバルになる
  - 人間が理解するためには以下の規約を適用するといい
    - /modules/A/B/C.ts
      - `namespace A { export namespace B { export namespace C { export const ... } } }`
    - 掘った階層内では `export` すること
    - 置く場所は人間が理解しやすくするためで、Rails のようにこの規約に沿わないとファイルが認識されないということではない
- class を複数使って多段にはできない
  - `namespace` で掘ること
  - 最上位でない `class` は `export` することを忘れないこと

# 具体例
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

# 注意点

## 複数ファイルではコード実行の順番依存がある
- 順番によっては undefined をレシーバにしてしまうことが起きうる
  - https://zenn.dev/tacck/articles/20211218_gas
  - `.clasp.json` に `filePushOrder` というプロパティで設定することはできるが継続的メンテが大変に面倒
  - ここは人間が「考えながら」作るしかない
    - ファイル名やディレクトリ名を工夫する
- これが起きるのは階層を切っている場合だと思われる
  - なぜなら、遅延評価になる（っぽい）から

## npm を使うときは `require` を使うこと
- `const fs = require('fs')` のようにして用いる
