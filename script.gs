GOOGLE_SHEET_ID = "1ejPmpiNUMiawfr4St9NNM1gGi1BFZbBvCXKxhDs9Umg";

REQUESTS_SHEET = "Poptávky";
REQUESTS_FIELDS = [
  { name: "ID", key: "id" },
  { name: "Datum", key: "datum" },
  { name: "Věc", key: "vec" },
  //{ name: "Velikost", key: "velikost" },
  //{ name: "Kategorie", key: "kategorie" },
  { name: "Jméno", key: "jmeno" },
  { name: "Příjmení", key: "prijmeni" },
  { name: "Adresa / místo dodání", key: "adresa" },
  { name: "Telefon", key: "telefon" },
  { name: "Email", key: "email" },
  { name: "Rezervace", key: "rezervace" },
  { name: "Nabízí", key: "nabizi" },
  { name: "Předáno", key: "predano" }

]

OFFERS_SHEET = "Nabídky";
OFFERS_FIELDS = [
  { name: "Nabídka", key: "nabidka" },
  { name: "Datum", key: "datum" },
  { name: "Jméno", key: "jmeno" },
  { name: "Příjmení", key: "prijmeni" },
  { name: "Místo předání", key: "misto" },
  { name: "Telefon", key: "telefon" },
  { name: "Email", key: "email" }
]



function doGet() {
  var template = HtmlService.createTemplateFromFile(`index.html`);
  return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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

function appendData(data, sheetName, fields) {
  var ss = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    init();
    sheet = ss.getSheetByName(sheetName);
  }

  var index = sheet.getLastRow() + 1;

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    item.datum = new Date();
    item.id = `${item.datum.getTime()}${Math.floor(Math.random() * 100)}`;
    item.telefon = !item.phone ? item.phone : "'" + item.phone;
    item.rezervace = `=COUNTIF('Nabídky'!$A$2:$A;"="&A${index})>0`;
    item.nabizi = `=IFNA(VLOOKUP(A${index};'Nabídky'!$A$2:$C;3;FALSE)&" "&VLOOKUP(A${index};'Nabídky'!$A$2:$E;4;FALSE);"")`;

    sheet.appendRow(fields.map(field => item[field.key]))
    sheet.getRange(index,fields.length-2).insertCheckboxes();
    sheet.getRange(index,fields.length).insertCheckboxes();
    index++
  }
}

function addRequest(data) {
  appendData(data,REQUESTS_SHEET,REQUESTS_FIELDS);
}