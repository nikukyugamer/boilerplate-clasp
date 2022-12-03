class Hoge {
  environment: 'production' | 'development'

  constructor(environment: 'production' | 'development') {
    this.environment = environment
  }

  greeting() {
    if (this.isProduction()) {
      console.log('Hoge! Hello, production environment! Hello, Hoge World!')
    } else if (this.isDevelopment()) {
      console.log('Hoge! Hello, development environment! Hello, Hoge World!')
    } else {
      throw new Error('Hoge! Invalid environment')
    }
  }

  isProduction() {
    return this.environment === 'production'
  }

  isDevelopment() {
    return this.environment === 'development'
  }
}
