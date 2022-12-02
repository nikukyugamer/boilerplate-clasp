namespace Foo {
  export const greeting = (_environment: 'production' | 'development') => {
    Logger.log('Hello, lib/Foo World!')
  }
}
