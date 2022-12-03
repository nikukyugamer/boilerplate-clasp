// サービスの API を追加しておく必要がある
// https://dev.classmethod.jp/articles/google-spread-sheet-create-a-function-with-gas-that-allows-you-to-filter-the-table-by-the-record-of-the-selected-cell/

class UniteRowHeight {
  changeRowHeights() {
    const spreadsheetId = '1234567890aBcDeFgHi'
    const worksheetName = 'ユーザー名'
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const worksheet = spreadsheet.getSheetByName(worksheetName)

    const defaultRowSize = 21

    const requests = {
      updateDimensionProperties: {
        properties: { pixelSize: defaultRowSize },
        range: {
          sheetId: worksheet.getSheetId(),
          startIndex: 1, // 2行目からが対象になる
          // endIndex: 100, // 書かない場合には全行が対象になる
          dimension: 'ROWS'
        },
        fields: 'pixelSize'
    }}

    // @ts-ignore
    Sheets.Spreadsheets.batchUpdate({ requests: requests }, spreadsheet.getId())
  }
}
