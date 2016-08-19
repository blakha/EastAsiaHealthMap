// 베이스 맵을 레이어로 만들어서 화면에 표시한다. 그리고 html에 추가한다. 

var map = L.map('map').setView([36, 127], 7);

 // load base map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// 그리고 제이쿼리 아작스로 맵 디비를 다운로드한다. (이거 느리면 안됨.)

var total_data;
var male_data;
var female_data;


var sigungu_map;
var sido_map;

//map

sigungu_map = new L.GeoJSON.AJAX('sugungu_geojson.geojson');
sido_map =  new L.GeoJSON.AJAX('sido_geojson.geojson');
var countyStyle = {
    	"color": "#cec4bc", // medium? brown  
    	"weight": 1,  // stroke weight in pixels
    	"opacity": 0.65
		};
//geojsonLayer.addTo(map);





// data
$.ajax({
            url:'./data/sum.json',
            dataType:'json',
            success: function(data) {
     	    total_data = data;
   		}
        });

$.ajax({
            url:'./data/male.json',
            dataType:'json',
            success: function(data) {
      		male_data = data;
   		}
        })

$.ajax({
            url:'./data/female.json',
            dataType:'json',
            success: function(data) {
     		female_data = data;
    	}
        })

function buttonClicked(){
	var geo_range_value;
	var cause_value;
	var gender_value;
	var mortality_value;
	var year_value;

	var filter_result =[];

	// get select tag value
	selectdone();

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

	if(geo_range_value == 'sigungu'){
	L.geoJson(sigungu_map, {
	style: function(feature) {
		for( key in filter_result){
		    if(feature.properties.sigungu_cd == filter_result[rcode3]){
		    	return {color: '#234'}
		    }else{
		    	return {color: '#000'}
		    }
    }
}
}).addTo(map);

	}else if(geo_range_value == 'sido'){
		L.geoJson(sido_map, {
		style: function(feature) {
		for( key in filter_result){
		    if(feature.properties.sido_cd == filter_result[rcode3]){
		    	return {color: '#234'}
		    }else{
		    	return {color: '#000'}
		    }
    }
}
}).addTo(map);
}
}


function selectDone() {

	// get select data from html
	var select_geo_range = document.getElementById("geomap");
	geo_range_value = select_geo_range.options[select_geo_range.selectedIndex].value;

	

	var select_cause = document.getElementById("cause");
	cause_value = select_cause.options[select_cause.selectedIndex].value;

	

	var select_gender = document.getElementById("gender");
	gender_value = select_gender.options[select_gender.selectedIndex].value;
	


	var select_mortality_rate = document.getElementById("mortality");
	mortality_value = select_mortality_rate.options[select_mortality_rate.selectedIndex].value;

	var select_year = document.getElementById("year");
	year_value = select_year.options[select_year.selectedIndex].value;
	
}


function listOfFilter(geo_range_value, cause_value, gender_value, mortality_value, year_value){
	if(gender_value == 'total'){
		for (tuple in total_data){
			if(total_data[tuple].year == year_value){
			filter_result.push({
				rcode3: total_data[tuple].rcode3,
				mortality_rate: total_data[tuple].cause_value
			});
			}
		}
	}else if(gender_value == 'male'){
		for (tuple in total_data){
			if(total_data[tuple].year == year_value){
			filter_result.push({
				rcode3: total_data[tuple].rcode3,
				mortality_rate: total_data[tuple].cause_value
			});
			}
		}

	}else if(gender_value == 'female'){
		for (tuple in total_data){
			if(total_data[tuple].year == year_value){
			filter_result.push({
				rcode3: total_data[tuple].rcode3,
				mortality_rate: total_data[tuple].cause_value
			});
			}
		}
	}
}



