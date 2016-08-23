//import * as d3 from "d3";

		var map = L.map('map').setView([36, 128], 7);

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
var items;
var maxThree = [];
var minThree = [];
var name_mortalityrate = {};


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
	if(geo_range_value == 'sido'){
		alert("sido data is currently not available");
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
/*
findMaxFive();

//d3.select("svg").remove();
d3.selectAll("svg > *").remove();

var svg = d3.select("#chart")
                .append("svg")
                .attr("width",700)
                .attr("height",400);

var x = d3.scale.ordinal()
                .domain(maxThree.map(function(d){return d.name}))
                .rangeRoundBands([0, 700]);

var y = d3.scale.linear()
                .domain([200,10])
                .range([0,250]);


var rect = svg.selectAll("rect")
                    .data(maxThree)
                    .enter()
                    .append("rect")
                    .attr("x", function(d){return x(d.name);})
                    .attr("y", function(d){console.log(d.rate); return 300-y(d.rate);})
                    .attr("width", x.rangeBand()-40)
                    .attr("height", function(d){return y(d.rate)})
                    .style("fill", "steelblue");
 

 var xAxis = d3.svg.axis()
                    .scale(x)
                    .outerTickSize(0)
                    .orient("bottom");
                    
 var yAxis = d3.svg.axis()
                        .scale(y)
                        .outerTickSize(0)
                        .ticks(5)
                        .tickPadding(-5)
                        .orient("left");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,350)")
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(700,50)")
        .call(yAxis);

*/

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
	name_mortalityrate = {};
	if(gender_value == 'both'){
		for (tuple in total_data){
			if(total_data[tuple].year == year_value){
				obj['rcode3'] = total_data[tuple].rcode3;
				obj['mortality_rate'] = Number(total_data[tuple][cause_value]);
				obj['sigungu_nm'] = total_data[tuple].rcode2.trim();
				filter_result.push(obj);
				obj = {};
				name_mortalityrate[total_data[tuple].rcode2.trim()] = Number(total_data[tuple][cause_value]);
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
				name_mortalityrate[total_data[tuple].rcode2.trim()] = Number(total_data[tuple][cause_value]);
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
				name_mortalityrate[total_data[tuple].rcode2.trim()] = Number(total_data[tuple][cause_value]);
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



// to make another array without data irrevelent to mortality rate {name: mortalityrate, ...}

function findMaxFive(){
minThree = [];
maxThree = [];
var obj2 = {};

// Create items array
items = Object.keys(name_mortalityrate).map(function(key) {
    return [key, name_mortalityrate[key]];
});

// Sort the array based on the second element
items.sort(function(first, second) {
    return second[1] - first[1];
});

// Create a new array with only the first 5 items
var sort_result_max = items.slice(0, 5);

for (idx in sort_result_max){
	obj2['name'] = sort_result_max[idx][0];
	obj2['rate'] = sort_result_max[idx][1];
	maxThree.push(obj2);
	obj2 = {};
}

/*
var items_len = items.length();

var sort_result_min = items.slice(items_len-4, 3);

for(idx2 in sort_result_min){
	obj2['name'] = sort_result_min[idx][0];
	obj2['rate'] = sort_result_min[idx][1];
	minThree.push(obj2);
	obj2 = {};
}
*/

}

/*
function drawGraph(){

}
*/