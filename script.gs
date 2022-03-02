GOOGLE_SHEET_ID = "1ejPmpiNUMiawfr4St9NNM1gGi1BFZbBvCXKxhDs9Umg";

REQUESTS_SHEET = "Poptávky";
REQUESTS_FIELDS = [
  { name: "ID", key: "id" },
  { name: "Datum", key: "date" },
  { name: "Věc", key: "thing" },
  //{ name: "Velikost", key: "size" },
  //{ name: "Kategorie", key: "category" },
  { name: "Jméno", key: "firstName" },
  { name: "Příjmení", key: "lastName" },
  { name: "Adresa / místo dodání", key: "address" },
  { name: "Telefon", key: "phone" },
  { name: "Email", key: "email" }
]

OFFERS_SHEET = "Nabídky";
OFFERS_FIELDS = [
  { name: "Datum", key: "date" },
  { name: "Jméno", key: "firstName" },
  { name: "Příjmení", key: "lastName" },
  { name: "Místo předání", key: "place" },
  { name: "Telefon", key: "phone" },
  { name: "Email", key: "email" }
]


function doGet() {
  var template = HtmlService.createTemplateFromFile(`index.html`);
  return template.evaluate();
}

function init() {
  var ss = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
  var requests = ss.getSheetByName(REQUESTS_SHEET);
  if (!requests) {
    requests = ss.insertSheet(REQUESTS_SHEET);
    requests.appendRow(REQUESTS_FIELDS.map(field => field.name))
  }

  var offers = ss.getSheetByName(OFFERS_SHEET);
  if (!offers) {
    offers = ss.insertSheet(OFFERS_SHEET);
    offers.appendRow(OFFERS_FIELDS.map(field => field.name))
  }
}

function appendData(data, sheet, fields) {
  var ss = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
  var sheet = ss.getSheetByName(sheet);

  if (!sheet) {
    init();
    sheet = ss.getSheetByName(sheet);
  }

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    item.date = new Date;
    item.id = `${item.date.getTime()}${Math.floor(Math.random() * 100)}`;
    item.phone = "'" + item.phone;

    sheet.appendRow(fields.map(field => item[field.key]))
  }
}
