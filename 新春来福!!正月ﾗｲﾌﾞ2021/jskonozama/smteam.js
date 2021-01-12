// Amazonの注文履歴をTSV形式で出力するスクリプト
//
// 2015-01-01 時点での DOM 構造に対応, GoogleCrome, Opera でテスト済。
// formatEntry関数を書き換えれば自由な書式で出力できます。
//
// 参考:
//  - Amazonの注文履歴をCSV形式にして出力するスクリプト
//    https://gist.github.com/arcatdmz/8500521
//  - Amazon で使った金額の合計を出す奴 (2014 年バージョン)
//    https://gist.github.com/polamjag/866a8af775c44b3c1a6d

(function(){

    // 各注文履歴をTSVフォーマットにして返す
    var datePattern = new RegExp("(\\d{4})年(\\d{1,2})月(\\d{1,2})日");
    function formatEntry(entry) {
        console.log(entry);
        entry.date.match(datePattern);
        var year = RegExp.$1;
        var month = RegExp.$2; if (month.length <= 1) month = "0" + month;
        var day = RegExp.$3; if (day.length <= 1) day = "0" + day;
        var date = "" + year + "/" + month + "/" + day;
        var arr = [date, entry.name, entry.author, entry.url];
        return arr.join('\t') + "\n";
    }

    function popup(content) {
        var generator=window.open('','name','height=250,width=700');
        generator.document.write('<html><head><title>Amazon to TSV</title>');
        generator.document.write('</head><body>');
        generator.document.write('<pre>');
        generator.document.write(content);
        generator.document.write('</pre>');
        generator.document.write('</body></html>');
        generator.document.close();
        return generator;
    }

    var itemDelimiter = " / ";
    var total = {};
    var year = '2014';
    var all = false;
    var dd="";
    var dlen=300;
    
    function init(num) {
        if(typeof num !== 'number') {
            var num = 0;
            $('<div/>').css({
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,.7)',
                color: '#fff',
                fontSize: 30,
                textAlign: 'center',
                paddingTop: '15em'
            }).attr('id', '___overlay').text('Amazonいくら使った？').appendTo('body');
            year = "all"; //window.prompt('何年分の注文を集計しますか？\n - 半角数字4桁で入力してください\n - 全期間を集計する場合は「all」と入力します', year);
            if(year === 'all') {
                all = true;
                //year = jQuery('div.top-controls select option:last').val().match(/[0-9]/g).join('');
            } else if(!/^[0-9]{4}$/.test(year)) {
                alert('正しい数値を入力してください');
                $('#___overlay').remove();
                return false;
            }
            year = Number(year);
        }
        // 第二引数を true にすると各商品とかエラーを逐一表示する
        var progress = load(num, false);
        $('#___overlay').text(year+'年の集計中…  / '+(num+1)+'ページ目');
        progress.done(function(results){
            if (typeof total[year] ===  'undefined') {
                total[year] = results;
            } else {
                total[year] = total[year].concat(results);
            }
            init(num+1);
        });
        //.fail(function(){
        
        
        if(num>dlen){
            if(all && new Date().getFullYear() > year) {
                year++;
                init(0);
            } else {
                var _total = 0;
                var _content = "";
                jQuery.each(total, function(year, results){
                    var yen = 0;
                    jQuery.each(results, function(){
                        yen += this.price;
                        $.each(this.items, function(i, item){
                            _content += formatEntry(item);
                        });
                    });
                    _total += yen;
                });
                // result
                $('#___overlay').remove();
                //alert(dd);
                //popup(_content);
                //console.log(dd);
            }
            	       var
             w=window
            ,d=w.document
            ;
			var dt = new Date();
                //location.href="data:attachment/csv,charset=utf-8,download='somedata.csv'"+encodeURIComponent(finishdata)
                TextDL(dd, dtstring(dt).replace(/[/ :\-]/g, ""));
dd="";
        return false;
        }
    }
    
    function load(num, verbose) {
        var df = jQuery.Deferred();
        var page = get(num, verbose);
        page.done(function(data){
            var dom = jQuery.parseHTML(data);
            var results = [];

            jQuery(dom).find('table').each(function(){
                var box = jQuery(this);
           
           
           //?url=http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fuser%2Fdetails%2F1094775
                var db = jQuery(box.find('tr')).html();
                var dateText = jQuery(box.find('td.Comment')).text();

                var items = [];
                var pubarr = box.find("div.a-row > span.a-size-small");
                box.find("div.a-row > a.a-link-normal").each(function(j) {
                    var item = {};
                    item.name = $(this).text().trim();
                    item.path = $(this).attr('href').trim();
                    item.url = 'https://www.amazon.co.jp' + item.path;
                    item.date = dateText;
                    item.author = $(pubarr[j*2]).text().trim().replace(/(\n)/g, '');
                    items.push(item);
                });


				var tmp =$(this).text();
				tmp=tmp.replace(/\r\n/gm,"");
				tmp=tmp.replace(/\n/gm,"");
				tmp=tmp.replace(/ｴﾗｰが発生しました｡お手数をおかけいたしますが､再読み込みしてください/gm,"");
				tmp=tmp.replace(/\t+/gm,"\t");
				
				db=db.match(/http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fguild%2Fguild_info%2F[0-9]+/);
				if(db==null){
				db="";
				}
				else if(db!=undefined || db!=null){
				//alert(db);
				db="ID:"+db[0].replace("http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fguild%2Fguild_info%2F","");
				}
				
				if(tmp)
				dd+=tmp+"\t"+db+"\r\n";//d+da+dateText;
				
                var priceText = jQuery(box.find('div.order-info span.value')[1]).text();
                var price = ""//Number(priceText.match(/[0-9]/g).join(''));

                if (verbose) console.log(item, price);
                results.push({'date':box,'items':items,'price':price});
            });
            
        if(num>dlen){
        df.reject();
        }

            if(results.length <= 0) df.reject();
            else df.resolve(results);
        });
        return df.promise();
    }
    
    
    function TextDL(text, name) {
        //ファイルを作成
        b = new Blob([text], {
            type: "text/plain"
        })

        //a要素を作る
        a = document.createElement('a')
            //ダウンロードする名前をセット
        a.download = name;
        //ダウンロードするファイルをセット
        a.href = window.URL.createObjectURL(b)

        //イベントを作る
        e = document.createEvent('MouseEvent')
        e.initEvent("click", true, true)
            //a要素をクリック
        a.dispatchEvent(e)
    }
	
	function dtstring(now){
	var yyyy = now.getFullYear();
	var mm = now.getMonth() + 1;
	var dd = now.getDate();
	var HH = now.getHours();
	var MM = now.getMinutes();
if (mm < 10) { mm = '0' + mm;}
if (dd < 10) { dd = '0' + dd;}
if (HH < 10) { HH = '0' + HH;}
if (MM < 10) { MM = '0' + MM;}

	return  (mm + "/" + dd + " " + HH + ":" + MM);
	}
    //http://g12017647.sp.pf.mbga.jp/?url=http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fevent%2Fnew_year_live_2021%2Franking_guild%2F1%2F3%3Fopensocial_app_id%3D12017647%26opensocial_viewer_id%3D71569686%26opensocial_owner_id%3D71569686
    //http://g12017647.sp.pf.mbga.jp/?url=http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fevent%2Fnew_year_live_2021%2Franking_guild%2F1%2F2%3Fopensocial_app_id%3D12017647%26opensocial_viewer_id%3D71569686%26opensocial_owner_id%3D71569686
    
    function get(num) {
        var df = jQuery.Deferred();
        jQuery.ajax({
            url: 'http://g12017647.sp.pf.mbga.jp/?url=http%3A%2F%2Fm.i-sidem.idolmaster.jp%2Fevent%2Fnew_year_live_2021%2Franking_guild%2F1%2F'+num,
            beforeSend: function (xhr){
                xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
            },
        })
            .success(function(data){
                df.resolve(data);
            })
            .fail(function(jqXHR, msg){
                if (verbose) console.log("fail", msg);
            });
            
        return df.promise();
    }
    
    if(typeof jQuery !== 'function') {
        var d=document;
        var s=d.createElement('script');
        s.src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
        s.onload=init;
        d.body.appendChild(s);
    } else {
        init();
    }
})();