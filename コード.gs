

function doGet() {

var toppage=HtmlService.createTemplateFromFile("sidem");

return toppage.evaluate();

}

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doPost(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

    var sname="ぼーだー";//シート名
    var boda=2;   //列番号 B=2
    var headrow=1;//3行目 行番号 1
    
    
  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById("1AIHNwxARRhhcn4iAFBuZnmLIG2Kzc-sWWenCkz4tBYs");
    
     //JSONでーたを受け取り
     var JSON_DATA= JSON.parse(e.parameter["BD_JSON"]);
     var log="(*^_^*)でーた入力にご協力ありがとうございます(*^_^*)～\r\nごっごるしーと受け皿でのろぐをお伝えします～\r\n\r\n";        
     log= log+"送信したJSONでーた:\r\n" + JSON.stringify(JSON_DATA)+"\r\n\r\n";
    
    
    
    log= log+"対象しーと名: 時刻,すこあ,すてーたす,行番号(0以下は更新なし)\r\n";
    
     //しーと＋時刻べつに仕分けする    
    var sheet = doc.getSheetByName(sname);  
    if (sheet.getRange(1,1).getValue()=="time"){
     
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = [];
    var timer=1;
    
    //おなじ日付のでーたがある場合更新停止
    if(sheet.getRange(2,1).getValue()!=timer){    
      
      
      
      if(JSON_DATA.length>1){
        for(var j=0;j<JSON_DATA.length;j++){
    if(sheet.getRange(2,1).getValue()!=""){
    sheet.insertRowBefore(2);
    }
      row = [];
    // loop through the header columns
    for (i in headers){
        if(JSON_DATA[j][headers[i]]==undefined){
        row.push("");
        }
      else{
        row.push(JSON_DATA[j][headers[i]]);     
      }
    } 
          sheet.getRange(2, 1, 1, row.length).setValues([row]);//2行目に貼り付ける
    
    log= log + "時速よび" + ":" +timer + "," + row[0] +  status(3) + "新規、3行目追加\r\n";

        
      }
      }
      else{
        
    //降順になるよう2行目にでーたをついか
    if(sheet.getRange(2,1).getValue()!=""){
    sheet.insertRowBefore(2);
    }
      
    // loop through the header columns
    for (i in headers){
        if(JSON_DATA[headers[i]]==undefined){
        row.push("");
        }
      else{
        row.push(JSON_DATA[headers[i]]);     
      }
    }
        
    
    sheet.getRange(2, 1, 1, row.length).setValues([row]);//2行目に貼り付ける
    
    log= log + "時速よび" + ":" +timer + "," + row[0] +  status(3) + "新規、3行目追加\r\n";
    }
    }
    else{    
      log= log + "時速よび" + "えらー重複 :　すでに同じ日付のでーたがあります"
    }
     }
      else{
      log= log + "時速よび" + ":へっどが所定の場所("     +headrow +","+ boda+")にありません、しーとを確認してください\r\n";
      }
      
    
    
    return ContentService.createTextOutput(log).setMimeType(ContentService.MimeType.JAVASCRIPT)
          
    
  } catch(e){
    // 何か例外発生時のろぐ
    return ContentService.createTextOutput(log + JSON.stringify({"結果":"エラー", "エラー": e})) .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } finally { //release lock
    lock.releaseLock();
  }
}

function status(d){
var st;
if(d>0){
st=",成功,"
}
else if(d==0){
st=",同じすこあが存在,"
}
else if(d==-1){
st=",検索対象なし,"
}
else if(d==-2){
st=",送信すこあが前回より小さい,"
}

return st;
}
