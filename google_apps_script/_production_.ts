function production() {
  const foo = new Foo('production')
  const hoge = new Hoge('production')

  foo.greeting()
  hoge.greeting()
}
