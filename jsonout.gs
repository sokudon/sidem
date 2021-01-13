/**
 * Return a list of sheet names in the Spreadsheet with the given ID.
 * @param {String} a Spreadsheet ID.
 * @return {Array} A list of sheet names.
 */

var sid="1AIHNwxARRhhcn4iAFBuZnmLIG2Kzc-sWWenCkz4tBYs";
var sname="ぼーだー";

function doGet() {
  var ss = SpreadsheetApp.openById(sid);
  var sheets = ss.getSheetByName(sname);
  
　var last_row = sheets.getLastRow();
　var last_col = sheets.getLastColumn();
  
  
   var values= sheets.getRange(1,1,last_row ,last_col).getValues();
  var str='var BD=' + JSON.stringify(values);
  //var str= "var BD = [" +values + "]";
  
  
  var sheet = ss.getSheetByName("イベ設定");
  
  var val= sheet.getRange(1,1,4,4).getValues();
  var dat =JSON.parse(JSON.stringify(val));

  var ibe=dat[1][0];//イベ名
  var sta=dat[1][2];//ISO8601
  var end=dat[1][3];//ISO8601

  var st = 'var ibe='+ JSON.stringify(ibe) +";"
    st += 'var start='+ JSON.stringify(sta) +";"
    st += 'var end='+ JSON.stringify(end) +";"
  
  str =st +  str;
 
  
  
  return ContentService.createTextOutput(str).setMimeType(ContentService.MimeType.JAVASCRIPT);
    //JSON.stringify(sheet.getName());
}

function wmap_getSheetsName(sheets){
  //var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheet_names = new Array();
  
  if (sheets.length >= 1) {  
    for(var i = 0;i < sheets.length; i++)
    {
      sheet_names.push(sheets[i].getName());
    }
  }
  return sheet_names;
}