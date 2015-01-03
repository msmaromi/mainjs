var yql = require("yql")
var fs = require("fs")
var acronym_list = {}	//	result acronym
//	crawl from site
new yql.exec('select * from data.html.cssselect where url="http://id.wiktionary.org/wiki/Wiktionary:Daftar_singkatan_dan_akronim_bahasa_Indonesia" and css="dl"', function(res) {	
	var dl_array = res.query.results.results.dl		
	for(var i=0; i<dl_array.length; i++) {
		var dt = dl_array[i].dt
		var dd = dl_array[i].dd

		if(dt.length == undefined) {	//	consist one element
			var key = dt.a.content	//	acronym
			var value = dd.p		//	long text

			//	check for multi value
			var arrValue = value.split(", ")
			if(arrValue.length > 1) {				
				value = []
				for(var k=0; k<arrValue.length; k++) {
					var elm = arrValue[k].replace(/[\d\s\.]+/, "");
					value.push(elm)
				}
			}

			//	insert only if key is new
			if (acronym_list[key] == undefined) {			
				acronym_list[key] = value
			}		
		} else {			
			for(var j=0; j<dt.length; j++) {				
				var key
				//	ignore unusual format
				if(dt[j].a != undefined) {
					key = dt[j].a.content
				}

				var value
				if(dd[j].p.content == undefined) {	//	unusual format
					value = dd[j].p			
				} else {
					value = dd[j].p.content
				}
								
				//	check for multi value
				var arrValue = value.split(", ")
				if(arrValue.length > 1) {				
					value = []
					for(var k=0; k<arrValue.length; k++) {
						var elm = arrValue[k].replace(/[\d\s\.]+/, "");
						value.push(elm)
					}
				}

				if (acronym_list[key] == undefined) {			
					acronym_list[key] = value
				}
			}
		}				
	}

	fs.writeFile('acronym.json', JSON.stringify(acronym_list, null, 4), function(err) {
		if (err) throw err;
  		console.log('Success!');
	})
	
})
