function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setFaviconUrl(
      "https://www.google.co.jp/images/branding/googleg/1x/googleg_standard_color_128dp.png"
    )
    .setTitle("ページタイトル");
}
