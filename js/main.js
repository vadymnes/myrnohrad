
// Map
var map = L.map('map').setView([49.422, 27.02], 13);


var mapbox_url = 'https://api.mapbox.com/styles/v1/evgeshadrozdova/ckl1654or031r17mvc4wr7edc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ';




L.tileLayer(

    // mapbox_url, {
    //     id: 'mapbox.light',
    //     maxZoom: 22
    'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    }).addTo(map);

map.scrollWheelZoom.disable();
var canvasRenderer = L.canvas();


/*створюємо шари на всі scrolling steps */
var step_800_1 = new L.LayerGroup(),
    step_800_2 = new L.LayerGroup(),
    step_800_3 = new L.LayerGroup(),
    step_800_4 = new L.LayerGroup();
var step_800_850_1 = new L.LayerGroup(),
    step_800_850_2 = new L.LayerGroup(),
    step_800_850_3 = new L.LayerGroup();
var step_850_900_1 = new L.LayerGroup(),
    step_850_900_2 = new L.LayerGroup(),
    step_850_900_3 = new L.LayerGroup();
var step_900_921_1 = new L.LayerGroup(),
    step_900_921_2 = new L.LayerGroup(),
    step_900_921_3 = new L.LayerGroup();
var step_921_940_1 = new L.LayerGroup(),
    step_921_940_2 = new L.LayerGroup(),
    step_921_940_3 = new L.LayerGroup();
var step_940_960_1 = new L.LayerGroup(),
    step_940_960_2 = new L.LayerGroup(),
    step_940_960_3 = new L.LayerGroup();
var step_960_970_1 = new L.LayerGroup();
var step_970_980_1 = new L.LayerGroup();
var step_980_990_1 = new L.LayerGroup();
var step_991_1 = new L.LayerGroup();


var buildingsColor = "#9d2f32", //"#f14633", //"#9d2f32",
    polygonsFillColor = "#c9d3b3", //"#899e91", //"#bbcda9", // "#fce0bc", //"#899e91", //"#a79d70",
    linesColor = "#0062A6", //'#4783fe',
    pointsColor = "#ff9d04"; //'#D7A319';

//визначаємо стилі для кожного типу елементів
var polygonsFillStyle = {
    weight: 1,
    fillOpacity: 0.7,
    opacity: 1,
    fillColor: polygonsFillColor,
    color: polygonsFillColor
};

var polygonsColorStyle = {
    weight: 2,
    opacity: 1,
    fillColor:"transparent",
    color: '#374969',
    dashArray: '5, 5',
    dashOffset: '0'
};

var buildingsStyle = {
    weight: 1,
    fillColor: buildingsColor,
    fillOpacity: 0.6,
    color: buildingsColor,
    opacity: 1
};

var linesStyle = {
    color: linesColor,
    opacity: 1
};


var geojsonMarkerOptions = {
    radius: 4,
    fillColor: pointsColor,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


//сірий стиль, задаємо для шарів, які зараз неактивні
var toGreyStyle = {
    opacity: 0.5,
    fillOpacity: 0.3,
    color: "silver",
    fillColor: "silver"
};


var mouseoverStyle = { color: "grey", weight: 3 };


//фільтруємо елементи на різні групи шарів за періодами

function filterBuildingsByPeriod(data, filter_property, period, popup, style, id_value){
    return L.geoJson(data, {
        id: id_value,
        filter: function(feat) { return feat.properties[filter_property] == period},
        renderer: canvasRenderer,
        style: function(){ return  style },
        onEachFeature: onEachFeatureClosure(buildingsColor, 1)
    }).bindPopup(popup);
}

function filterPoligonsByPeriod_F(data, filter_property, period, popup, style, id_value){
    return L.geoJson(data, {
        id: id_value,
        filter: function(feat) { return feat.properties[filter_property] == period},
        renderer: canvasRenderer,
        style: function(){ return  style }
    }).bindPopup(popup);
}

function filterPoligonsByPeriod_C(data, filter_property, period, popup, style, id_value){
    return L.geoJson(data, {
        id: id_value,
        filter: function(feat) { return feat.properties[filter_property] == period},
        renderer: canvasRenderer,
        style: function(){ return  style }
    }).bindPopup(popup);
}



function filterLinesByPeriod(data, streetlist, popup, id_value){
    return L.geoJson(data, {
        id: id_value,
        filter: function(feat) { return  streetlist.includes(feat.properties["name"]) },
        renderer: canvasRenderer,
        style: function(){ return  linesStyle },
        onEachFeature: onEachFeatureClosure("blue", 3)
    }).bindPopup(popup);
}


function filterPointsByPeriod(data, filter_property, period, popup, id_value){
    return L.geoJson(data, {
        id: id_value,
        filter: function(feat) { return feat.properties[filter_property] == period },
        renderer: canvasRenderer,
        onEachFeature: onEachFeatureClosure("green", 1),
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).bindPopup(popup);
}

fetch("data/polygonsData_4326_fill.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "-1800", "polygon", polygonsFillStyle, "polygonsF").addTo(step_800_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1850-1900", "polygon", polygonsFillStyle, "polygonsF").addTo(step_850_900_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1900-1921", "polygon", polygonsFillStyle, "polygonsF").addTo(step_900_921_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1921-1940", "polygon", polygonsFillStyle, "polygonsF").addTo(step_921_940_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1940-1960", "polygon", polygonsFillStyle, "polygonsF").addTo(step_940_960_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1960-1970", "polygon", polygonsFillStyle, "polygonsF").addTo(step_960_970_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1970-1980", "polygon", polygonsFillStyle, "polygonsF").addTo(step_970_980_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1980-1990", "polygon", polygonsFillStyle, "polygonsF").addTo(step_980_990_1);
        filterPoligonsByPeriod_F(data, "Data polygonsData_period", "1980-1990", "polygon", polygonsFillStyle, "polygonsF").addTo(step_980_990_1);
    });


fetch("data/polygonsData_4326_color.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "-1800", "polygon", polygonsColorStyle, "polygonsC").addTo(step_800_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1850-1900", "polygon", polygonsColorStyle, "polygonsC").addTo(step_850_900_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1900-1921", "polygon", polygonsColorStyle, "polygonsC").addTo(step_900_921_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1921-1940", "polygon", polygonsColorStyle, "polygonsC").addTo(step_921_940_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1940-1960", "polygon", polygonsColorStyle, "polygonsC").addTo(step_940_960_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1960-1970", "polygon", polygonsColorStyle, "polygonsC").addTo(step_960_970_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1970-1980", "polygon", polygonsColorStyle, "polygonsC").addTo(step_970_980_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1980-1990", "polygon", polygonsColorStyle, "polygonsC").addTo(step_980_990_1);
        filterPoligonsByPeriod_C(data, "Data polygonsData_period", "1980-1990", "polygon", polygonsColorStyle, "polygonsC").addTo(step_980_990_1);
    });


fetch("data/osmData_4326.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {
        filterBuildingsByPeriod(data, "Data osmData_period", "1800-1850", "building", buildingsStyle, "building").addTo(step_800_850_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1850-1900", "building", buildingsStyle, "building").addTo(step_850_900_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1900-1921", "building", buildingsStyle, "building").addTo(step_900_921_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1921-1940", "building", buildingsStyle, "building").addTo(step_921_940_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1940-1960", "building", buildingsStyle, "building").addTo(step_940_960_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1960-1970", "building", buildingsStyle, "building").addTo(step_960_970_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1970-1980", "building", buildingsStyle, "building").addTo(step_970_980_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1980-1990", "building", buildingsStyle, "building").addTo(step_980_990_1);
        filterBuildingsByPeriod(data, "Data osmData_period", "1991-", "building", buildingsStyle, "building").addTo(step_991_1);
    });


fetch("data/linesData_4326.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {
        filterLinesByPeriod(data, ["Шлях на Кам'янець", "Шлях на Летичів"], "line", "lines").addTo(step_800_850_1);
        filterLinesByPeriod(data,["Вул. Кам'янецька", "вул. Ремісницька", "вул. Соборна", "вул. Набережна", "вул. Аптекарська", "вул. Старобульварна", "вул. Коммерційна", "вул. Купецька", "Вул. Дворянська"], "line", "lines").addTo(step_800_850_2);
    });


fetch("data/pointsData_4326.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {
        filterPointsByPeriod(data, "Data pointsData_period", "-1800", "point", "points").addTo(step_800_1);
        filterPointsByPeriod(data, "Data pointsData_period", "1800-1850", "point", "points").addTo(step_800_850_1);
        filterPointsByPeriod(data, "Data pointsData_period", "1850-1900", "point", "points").addTo(step_850_900_1);
        filterPointsByPeriod(data, "Data pointsData_period", "1900-1921", "point", "points").addTo(step_900_921_1);
    });



//щоб передати змнну у кожен клік
function onEachFeatureClosure(defaultColor, weightValue) {
    return function onEachFeature(feature, layer) {
        layer.on('mouseover', function (e) {  e.target.setStyle(mouseoverStyle); });
        layer.on('mouseout', function (e) {  e.target.setStyle({ color: defaultColor, weight: weightValue }); });
    }
}

function returnPreviousStyle(layer) {
    console.log(layer.options.id);
    let pane = layer.options.id;
    if(pane === "building"){
        layer.setStyle(buildingsStyle);
    } else if(pane === "polygonsF"){
        layer.setStyle(polygonsFillStyle);
    }  else if(pane === "polygonsC"){
        layer.setStyle(polygonsColorStyle);
    } else if(pane === "lines"){
        layer.setStyle(linesStyle);
    } else if(pane === "points"){
        layer.setStyle(geojsonMarkerOptions);
    }
}


var container = $('#scroll');
var graphic = $('#scroll > .scroll__graphic'); //container.select('.scroll__graphic');
var text = $('#scroll > .scroll__text'); //container.select('.scroll__text');
var step = $('#scroll > .scroll__text > .step'); // text.selectAll('.step');
var scroller = scrollama();


//        function handleResize() {
//            var stepHeight = Math.floor(window.innerHeight * 0.5);
//            step.css('height', stepHeight + 'px');
//            var bodyWidth = d3.select('body').node().offsetWidth;
//            var textWidth = text.node().offsetWidth;
//            var graphicWidth = bodyWidth - textWidth;
//            var chartMargin = 32;
//            var chartWidth = graphic.node().offsetWidth - chartMargin;
//            scroller.resize();
//        }


// scrollama event handlers
function handleStepEnter(r) {
    if(r.index > 0) {

        if(r.index === 3){
            $("#pic-overlay").css("display", "flex").hide().fadeIn(1000)
        }
        else if(r.index != 3){
            $("#pic-overlay").fadeOut(1000);
        }
        map.flyTo([49.422, 27.02], 14);
        let layerToAdd = $(r.element).data("stuff")[0];
        let layerToRemove = $(r.element).data("stuff")[1];
        let layerToGrey = $(r.element).data("stuff")[2];

        //всі кроки окрім першого та останнього
        if(r.direction === "down" && layerToGrey != 'none'){
            eval(layerToAdd).addTo(map);
            eval(layerToGrey).eachLayer(function(layer) {layer.setStyle(toGreyStyle);});
        } else if(r.direction === "down" && layerToGrey === 'none'){
            eval(layerToAdd).addTo(map);
        } else if(r.direction === "up" && layerToRemove != 'none'){
            map.removeLayer(eval(layerToRemove));
            eval(layerToAdd).eachLayer(function(layer) {
                returnPreviousStyle(layer)
            });
        }
    } 
}


function handleContainerEnter(response) {
    // response = { direction }
}

function handleContainerExit(response) {
    // response = { direction }
}



function init() {
    //handleResize();
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
        offset: 0.9,
        debug: false
    })
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);
    //window.addEventListener('resize', handleResize);
}
init();


//// не потрібне



// var mapbox_url = 'https://api.mapbox.com/styles/v1/evgeshadrozdova/ckl1654or031r17mvc4wr7edc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ';
//
//
//                mapbox_url, {
//                    id: 'mapbox.light',
//                    maxZoom: 22,
// //жовта
//                    'https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
//            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//                    apikey: 'df31e4fff5414a59929dc29ff3a71cfc',
//                    maxZoom: 22,


//чорна
//                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//            subdomains: 'abcd',
//            maxZoom: 19,




//якщо потрібно рознести шари на різні pane та різні канваси
//map.createPane('buildings');
// var buildingsRenderer = L.canvas({ padding: 0.5, pane: 'buildings' });



//це якщо треба додати можливість вмикати/вимикати шари
//var layerControl = L.control.layers().addTo(map);
//layerControl.addOverlay(buldings_900_921, "buldings_900_921");


// плани різних років з тайлів (поки не треба)
//        var p_800 = L.tileLayer('./tiles/plan_1800/{z}/{x}/{y}.png', {tms: true, opacity: 0.9, attribution: "",  pane: 'oldmaps'});
//        var p_944 = L.tileLayer('./tiles/plan_1944/{z}/{x}/{y}.png', {tms: true, opacity: 0.9, attribution: "",  pane: 'oldmaps'});
//        var p_888 = L.tileLayer('./tiles/plan_1888/{z}/{x}/{y}.png', {tms: true, opacity: 0.9, attribution: "",  pane: 'oldmaps'});





//        function getColor(d) { return d > 1980 ? 'green' :  d > 1950  ? 'red' :  'blue'; }
//
//        function buildingsStyle(feature) {
//           return {
//               fillColor: getColor(feature.properties["Data osmData_StartYear"]),
//               weight: 1,
//               color: getColor(feature.properties["Data osmData_StartYear"]),
//               fillOpacity: 0.5  };
//        }




// міняємо періоди по кліку
// $(".change_period").on("click", function(){
//     $(".change_period").removeClass("active");
//     $(this).addClass("active");
//     let myarray = $(this).data('stuff');
//     eval(myarrtoReturnay[0]).addTo(map);
//
//     if(myarray[1] != "none"){
//         eval(myarray[1]).eachLayer(function(layer) {
//             layer.setStyle(toGreyStyle);
//         });
//     }
// });