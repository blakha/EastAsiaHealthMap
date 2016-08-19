	
		var map = L.map('map').setView([40, 132], 5);

		// load base map
		var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    	});

    	baseLayer.addTo(map);

// 베이스 맵을 레이어로 만들어서 화면에 표시한다. 그리고 html에 추가한다. 


// 그리고 제이쿼리 아작스로 맵 디비를 다운로드한다. (이거 느리면 안됨.)

var total_data;
var male_data;
var female_data;


var sigungu_map;
var sido_map;


var geo_range_value;
	var cause_value;
	var gender_value ;
	var mortality_value ;
	var year_value;

	var filter_result =[];
	var sido_ajax;
	var sigungu_ajax;




// data
$.ajax({
            url:'./data/total_data.json',
            dataType:'json',
            async: false,
            success: function(data) {
     	    total_data = data;
   		}
        });


$.ajax({
            url:'./data/male_data.json',
            dataType:'json',
            async: false,
            success: function(data) {
      		male_data = data;
   		}
        })

$.ajax({
            url:'./data/female_data.json',
            dataType:'json',
            async: false,
            success: function(data) {
     		female_data = data;
    	}
        })

$.ajax({
            url:'./data/sido_simple.geojson',
            dataType:'json',
            async: false,
            success: function(data) {
     	    sido_ajax = data;
   		}
        });
$.ajax({
            url:'./data/sigungu_simple.geojson',
            dataType:'json',
            async: false,
            success: function(data) {
     	    sigungu_ajax = data;
   		}
        });

var layerControl;
var legendControl;
var options;
var choropleth = null;
var min, max;

sido_map = L.geoJson(sido_ajax);
sigungu_map= L.geoJson(sigungu_ajax);

/*
layerControl = new L.Control.Layers({
	'osm': baseLayer
});


layerControl.addTo(map);
*/
legendControl = new L.Control.Legend();

legendControl.addTo(map);




function buttonClicked(){
	
	// get select tag value
	selectDone();
	// check if selection is not default
	if(geo_range_value == 'default1') {
		alert("Choose the geo_range value.");
		return;
	}
	if(cause_value == 'default2'){
		alert("Choose cause of Death.");
		return;
	}
	if(gender_value == 'default3'){
		alert("Choose gender option.");
		return;
	}
	if(mortality_value == 'default4'){
		alert("Choose mortality rate.");
		return;
	}
	if(year_value == 'default5'){
		alert("Choose year.");
		return;
	}
	// make filter on tile
	listOfFilter(geo_range_value, cause_value, gender_value, mortality_value, year_value);

	min = 999999;
	max = 0;
	findMinMax(filter_result);

	if(min > max){
		console.log("error");
		return;
	}

	if(choropleth != undefined){
		map.removeLayer(choropleth);
	}


if(geo_range_value == 'sigungu'){
options = {
	locationMode: L.LocationModes.LOOKUP,
	recordsField: null,
	codeField: 'rcode3',
	locationLookup: sigungu_ajax,
	locationTextField: 'sigungu_nm',
	includeBoundary: true,
	layerOptions:{
		fillOpacity: 0.9,
		opacity: 1,
		weight: 1
	},
	
	displayOptions:{
		mortality_rate: {
			displayName: 'mortality_rate',
			fillColor: new L.HSLHueFunction(new L.Point(min, 100), new L.Point(max, 330)),
			color:new L.HSLHueFunction(new L.Point(min, 100), new L.Point(max, 330))
		}
	}

};

}else if(geo_range_value == 'sido'){


options = {
	locationMode: L.LocationModes.LOOKUP,
	recordsField: null,
	codeField: 'rcode3',
	locationLookup: sido_ajax,
	locationTextField: 'sigungu_nm',
	includeBoundary: true,
	layerOptions:{
		fillOpacity: 0.9,
		opacity: 1,
		weight: 1
	},
	
	displayOptions:{
		mortality_rate: {
			displayName: 'mortality_rate',
			fillColor: new L.HSLHueFunction(new L.Point(min, 100), new L.Point(max, 330)),
			color:new L.HSLHueFunction(new L.Point(min, 100), new L.Point(max, 330))
		}
	}

};

}


choropleth = new L.ChoroplethDataLayer(filter_result,options);
map.addLayer(choropleth);
//layerControl.addOverlay(choropleth, geo_range_value.concat("_", cause_value, "_", gender_value, "_", year_value));



}



function getColor(propertyValue){
	var j;
	var k;
	for( j = 0; j < filter_result.length ; j = j + 1){
			for( k = 0; k < filter_result[j].length ; k = k + 1){
		    if(propertyValue == filter_result[j][k]['rcode3']){
		    	return '#efff6c';
		    }
    }
	}
	return '#342123'
}




function selectDone() {

	// get select data from html
	var select_geo_range = document.getElementById("geomap");
	geo_range_value = select_geo_range.options[select_geo_range.selectedIndex].value;


	var select_cause = document.getElementById("cause");
	cause_value = select_cause.options[select_cause.selectedIndex].value;

	

	var select_gender = document.getElementById("gender");
	gender_value = select_gender.options[select_gender.selectedIndex].value;
	

	var select_year = document.getElementById("year");
	year_value = select_year.options[select_year.selectedIndex].value;
	
}


var filter_result = [];

var obj = {};
 


function listOfFilter(geo_range_value, cause_value, gender_value, mortality_value, year_value){
	obj = {};
	filter_result = [];
	if(gender_value == 'both'){
		console.log(cause_value);
		for (tuple in total_data){
			if(total_data[tuple].year == year_value){
				obj['rcode3'] = total_data[tuple].rcode3;
				obj['mortality_rate'] = Number(total_data[tuple][cause_value]);
				console.log(total_data[tuple].sigungu_nm);
				obj['sigungu_nm'] = total_data[tuple].rcode2.trim();
				filter_result.push(obj);
				obj = {};
				}
			}
	}else if(gender_value == 'men'){
		for (tuple in male_data){
			if(male_data[tuple].year == year_value){
				obj['rcode3'] = male_data[tuple].rcode3;
				obj['mortality_rate'] = Number(male_data[tuple][cause_value]);
				obj['sigungu_nm'] = total_data[tuple].rcode2.trim();
				filter_result.push(obj);
				obj = {};
				}
			}
	}else if(gender_value == 'women'){
		for (tuple in female_data){
			if(female_data[tuple].year == year_value){
				obj['rcode3'] = female_data[tuple].rcode3;
				obj['mortality_rate'] = Number(female_data[tuple][cause_value]);
				obj['sigungu_nm'] = total_data[tuple].rcode2.trim();
				filter_result.push(obj);
				obj = {};
				}
			}
		}
	}

	function findMinMax(result_array){
		for (i in result_array){
			if(result_array[i].mortality_rate < min){
				min = result_array[i].mortality_rate;
			}
			if(result_array[i].mortality_rate > max){
				max = result_array[i].mortality_rate;
			}
		}
	}




