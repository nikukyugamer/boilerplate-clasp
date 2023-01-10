// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doGet() {
  // eslint-disable-next-line no-undef
  const activeUserEmail = Session.getActiveUser().getEmail()

  // eslint-disable-next-line no-undef
  console.log(Session.getActiveUser().getEmail()) // hogefuga@gmail.com
  // eslint-disable-next-line no-undef
  console.log(Session.getActiveUser().getUsername()) // hogefuga

  if (['ok@example.com', 'good@example.com'].includes(activeUserEmail)) {
    // eslint-disable-next-line no-undef
    return HtmlService.createHtmlOutputFromFile('index')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setFaviconUrl(
        'https://www.google.co.jp/images/branding/googleg/1x/googleg_standard_color_128dp.png'
      )
      .setTitle('ページタイトル')
  } else {
    // eslint-disable-next-line no-undef
    return HtmlService.createHtmlOutputFromFile('404')
  }
}
