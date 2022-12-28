class Foo {
  environment: 'production' | 'development'

  constructor(environment: 'production' | 'development') {
    this.environment = environment
  }

  greeting() {
    console.log(Constants.TARGET_URL)

    if (this.isProduction()) {
      console.log('Foo! Hello, production environment! Hello, Foo World!')
    } else if (this.isDevelopment()) {
      console.log('Foo! Hello, development environment! Hello, Foo World!')
    } else {
      throw new Error('Foo! Invalid environment')
    }
  }

  isProduction() {
    return this.environment === 'production'
  }

  isDevelopment() {
    return this.environment === 'development'
  }
}
