namespace Hoge {
  export const greeting = (environment: 'production' | 'development') => {
    if (environment === 'production') {
      console.log('Hello, lib/Hoge World on production!')
    } else if (environment === 'development') {
      console.log('Hello, lib/Hoge World on development!')
    }
  }
}
