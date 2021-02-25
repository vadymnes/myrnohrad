
// Map
var map = L.map('map').setView([49.422, 27.02], 13);

L.tileLayer(
    'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    }).addTo(map);

map.scrollWheelZoom.disable();
var canvasRenderer = L.canvas();

const layerGroups = ["step_800_1", "step_800_2", "step_800_3", "step_800_4",
    "step_800_850_1", "step_800_850_2", "step_800_850_3",
    "step_850_900_1", "step_850_900_2", "step_850_900_3", "step_850_900_4"];





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
    step_850_900_3 = new L.LayerGroup(),
    step_850_900_4 = new L.LayerGroup();
var step_900_920_1 = new L.LayerGroup(),
    step_900_920_2 = new L.LayerGroup(),
    step_900_920_3 = new L.LayerGroup();
var step_920_945_1 = new L.LayerGroup(),
    step_920_945_2 = new L.LayerGroup(),
    step_920_945_3 = new L.LayerGroup();
var step_945_960_1 = new L.LayerGroup(),
    step_945_960_2 = new L.LayerGroup(),
    step_945_960_3 = new L.LayerGroup();
var step_960_970_1 = new L.LayerGroup(),
    step_960_970_2 = new L.LayerGroup(),
    step_960_970_3 = new L.LayerGroup();
var step_970_980_1 = new L.LayerGroup(),
    step_970_980_2 = new L.LayerGroup(),
    step_970_980_3 = new L.LayerGroup();
var step_980_990_1 = new L.LayerGroup(),
    step_980_990_2 = new L.LayerGroup(),
    step_980_990_3 = new L.LayerGroup();
var step_991_1 = new L.LayerGroup(),
    step_991_2 = new L.LayerGroup(),
    step_991_3 = new L.LayerGroup();


var pulseLayer = new L.LayerGroup();

var buildingsColor = "#9d2f32", //"#f14633", //"#9d2f32",
    polygonsFillColor = "#c9d3b3", //"#899e91", //"#bbcda9", // "#fce0bc", //"#899e91", //"#a79d70",
    linesColor = "#0089C0", //'#4783fe',
    pointsColor = "#ff9d04",//'#D7A319';
    polygonsStrokeColor = '#CE4066'; //'#374969'

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
    color: polygonsStrokeColor,
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


var mouseoverStyle = { color: "#574144", weight: 3, opacity: 1, fillOpacity: 0.6 };


//фільтруємо елементи на різні групи шарів за періодами

function filterByPeriod(data, filter_property, period, popup, style, id_value){
    if(id_value === "points"){
        return L.geoJson(data, {
            id: id_value,
            filter: function (feat) { return feat.properties[filter_property] == period },
            renderer: canvasRenderer,
            onEachFeature: onEachFeatureClosure("green", 1),
            pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, geojsonMarkerOptions); }
        });

    }  else {
        return L.geoJson(data, {
            id: id_value,
            filter: function(feat) { return feat.properties[filter_property] == period},
            renderer: canvasRenderer,
            onEachFeature: onEachFeatureClosure("green", 1),

            style: function(){ return  style }
        });
    }
}


function loopOnBuilding() {

    let thisId = $(this).data("details")[1];
    let currentLayer = $(this).data("details")[0];
    eval(currentLayer).eachLayer(function(layer) {
        for (let i=0; i < layer.getLayers().length; i++) {
            let current = layer.getLayers()[i].feature.properties.id;
            if(current.toString() === thisId.toString()){
                pulseLayer.clearLayers();
                //layer.getLayers()[i].setStyle(mouseoverStyle);
                const pulsatingIcon = generatePulsatingMarker(10, 'orange');
                L.marker(layer.getLayers()[i].getBounds().getCenter(), { icon: pulsatingIcon}).addTo(pulseLayer);
                pulseLayer.addTo(map);

            }
        }
    });
}


function loopOn() {
    let thisId = $(this).data("details")[1];
    let currentLayer = $(this).data("details")[0];
    eval(currentLayer).eachLayer(function(layer) {
        for (let i=0; i < layer.getLayers().length; i++) {
            let current = layer.getLayers()[i].feature.properties.id;
            if(current.toString() === thisId.toString()){
                layer.getLayers()[i].setStyle(mouseoverStyle); 
            }
        }
    });
}

function loopOut() {
    //map.removeLayer(pulseLayer)
    let currentLayer = $(this).data("details")[0];
    let steplayer = $(this).closest(".step").data("stuff")[0];
    map.removeLayer(pulseLayer);
    if(steplayer === currentLayer){
        eval(currentLayer).eachLayer(function(layer) {
            returnPreviousStyle(layer);
        });
    } else {
        eval(currentLayer).eachLayer(function(layer) {
            layer.setStyle(toGreyStyle)
        });
    }

}

$(".highlight")
    .on("mouseover", loopOn)
    .on("mouseout", loopOut);

$(".highlight-building")
    .on("mouseover", loopOnBuilding)
    .on("mouseout", loopOut);




const generatePulsatingMarker = function (radius, color) {
    const cssStyle = `
    width: ${radius}px;
    height: ${radius}px;
    background: ${color};
    color: ${color};
    opacity: 0.5;
    box-shadow: 0 0 0 ${color};
  `
    return L.divIcon({
        html: `<span style="${cssStyle}" class="pulse"/>`,
        className: ''
    })
};


$("#show-coat")
    .on("mouseover", function(){ $("#coat").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function(){  $("#coat").hide();  });

$("#show-diploma")
    .on("mouseover", function() { $("#diploma").css("display", "flex").show() })
    .on("mouseout", function(){  $("#diploma").hide(); });


//функція, якою ми розкидаємо всі наші обʼєкти відповідно до зазначеного в них кроку

function scatterToLayers(df, stepColumn, popupColumn, style, layer_id){
    filterByPeriod(df, stepColumn, "step_-1800_1", popupColumn, style, layer_id).addTo(step_800_1);
    filterByPeriod(df, stepColumn, "step_-1800_2", popupColumn, style, layer_id).addTo(step_800_2);
    filterByPeriod(df, stepColumn, "step_-1800_3", popupColumn, style, layer_id).addTo(step_800_3);
    filterByPeriod(df, stepColumn, "step_-1800_4", popupColumn, style, layer_id).addTo(step_800_4);
    filterByPeriod(df, stepColumn, "step_1800-1850_1", popupColumn, style, layer_id).addTo(step_800_850_1);
    filterByPeriod(df, stepColumn, "step_1800-1850_2", popupColumn, style, layer_id).addTo(step_800_850_2);

    filterByPeriod(df, stepColumn, "step_1850-1900_1", popupColumn, style, layer_id).addTo(step_850_900_1);
    filterByPeriod(df, stepColumn, "step_1850-1900_2", popupColumn, style, layer_id).addTo(step_850_900_2);
    filterByPeriod(df, stepColumn, "step_1850-1900_3", popupColumn, style, layer_id).addTo(step_850_900_3);
    filterByPeriod(df, stepColumn, "step_1850-1900_4", popupColumn, style, layer_id).addTo(step_850_900_4);

    filterByPeriod(df, stepColumn, "step_1900-1920_1", popupColumn, style, layer_id).addTo(step_900_920_1);
    filterByPeriod(df, stepColumn, "step_1900-1920_2", popupColumn, style, layer_id).addTo(step_900_920_2);
    filterByPeriod(df, stepColumn, "step_1900-1920_3", popupColumn, style, layer_id).addTo(step_900_920_3);

    filterByPeriod(df, stepColumn, "step_1920-1945_1", popupColumn, style, layer_id).addTo(step_920_945_1);
    filterByPeriod(df, stepColumn, "step_1920-1945_2", popupColumn, style, layer_id).addTo(step_920_945_2);
    filterByPeriod(df, stepColumn, "step_1920-1945_3", popupColumn, style, layer_id).addTo(step_920_945_3);

    filterByPeriod(df, stepColumn, "step_1945-1960_1", popupColumn, style, layer_id).addTo(step_945_960_1);
    filterByPeriod(df, stepColumn, "step_1945-1960_2", popupColumn, style, layer_id).addTo(step_945_960_2);
    filterByPeriod(df, stepColumn, "step_1945-1960_3", popupColumn, style, layer_id).addTo(step_945_960_3);

    filterByPeriod(df, stepColumn, "step_60-70_1", popupColumn, style, layer_id).addTo(step_960_970_1);
    filterByPeriod(df, stepColumn, "step_60-70_2", popupColumn, style, layer_id).addTo(step_960_970_2);
    filterByPeriod(df, stepColumn, "step_60-70_3", popupColumn, style, layer_id).addTo(step_960_970_3);

    filterByPeriod(df, stepColumn, "step_70-80_1", popupColumn, style, layer_id).addTo(step_970_980_1);
    filterByPeriod(df, stepColumn, "step_70-80_2", popupColumn, style, layer_id).addTo(step_970_980_2);
    filterByPeriod(df, stepColumn, "step_70-80_3", popupColumn, style, layer_id).addTo(step_970_980_3);

    filterByPeriod(df, stepColumn, "step_80-90_1", popupColumn, style, layer_id).addTo(step_980_990_1);
    filterByPeriod(df, stepColumn, "step_80-90_2", popupColumn, style, layer_id).addTo(step_980_990_2);
    filterByPeriod(df, stepColumn, "step_80-90_3", popupColumn, style, layer_id).addTo(step_980_990_3);

    filterByPeriod(df, stepColumn, "step_1990+_1", popupColumn, style, layer_id).addTo(step_991_1);
    filterByPeriod(df, stepColumn, "step_1990+_2", popupColumn, style, layer_id).addTo(step_991_2);
    filterByPeriod(df, stepColumn, "step_1990+_3", popupColumn, style, layer_id).addTo(step_991_3);

}

fetch("data/polygonsData_4326_fill.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        data.features.forEach(function(d){
            d.properties.info = d.properties.polygonsDataF_25_02_popup;
            d.properties.picture = d.properties.polygonsDataF_25_02_photo;
            d.properties.year = d.properties.polygonsDataF_25_02_year;
            delete d.properties.polygonsDataF_25_02_popup;
            delete d.properties.polygonsDataF_25_02_year;
            delete d.properties.polygonsDataF_25_02_photo;
        });


        let layer_id = "polygonsF";
        let stepColumn = "polygonsDataF_step";
        let style = polygonsFillStyle;
        let popupColumn = "polygon";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });


fetch("data/polygonsData_4326_color.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        data.features.forEach(function(d){
            d.properties.info = d.properties.polygonsDataС_25_02_popup;
            d.properties.picture = d.properties.polygonsDataС_25_02_photo;
            d.properties.year = d.properties.polygonsDataС_year;
            delete d.properties.polygonsDataС_25_02_popup;
            delete d.properties.polygonsDataС_year;
            delete d.properties.polygonsDataС_25_02_photo;
        });

        let layer_id = "polygonsC";
        let stepColumn = "polygonsDataС_step";
        let style = polygonsColorStyle;
        let popupColumn = "polygon";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });


fetch("data/osmData_4326.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        /* тут колонка з id називається інакше, тому ренеймимо*/
        data.features.forEach(function(d){
            d.properties.id = d.properties.osm_id;
            d.properties.name = d.properties.osmData_25_02_Shortdescription;
            d.properties.info = d.properties.osmData_25_02_Info;
            d.properties.picture = d.properties.osmData_25_02_photo;
            d.properties.year = d.properties.osmData_25_02_StartYear;
            delete d.properties.osm_id;
            delete d.properties.osmData_25_02_Shortdescription;
            delete d.properties.osmData_25_02_Info;
            delete d.properties.osmData_25_02_StartYear;
            delete d.properties.osmData_25_02_photo;
        });

        let layer_id = "building";
        let stepColumn = "osmData_25_02_step";
        let style = buildingsStyle;
        let popupColumn = "building";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });


fetch("data/linesData_4326_2.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        let layer_id = "lines";
        let stepColumn = "linesData_25_02_steps";
        let style = linesStyle;
        let popupColumn = "line";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });


fetch("data/pointsData_4326.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        data.features.forEach(function(d){
            d.properties.name = d.properties.pointsData_25_02_name;
            d.properties.info = d.properties.pointsData_25_02_popup;
            d.properties.picture = d.properties.pointsData_25_02_photo;
            d.properties.year = d.properties.pointsData_25_02_year;
            delete d.properties.pointsData_25_02_name;
            delete d.properties.pointsData_25_02_popup;
            delete d.properties.pointsData_25_02_photo;
            delete d.properties.pointsData_25_02_year;
        });


        let layer_id = "points";
        let stepColumn = "pointsData_25_02_Step";
        let style = geojsonMarkerOptions;
        let popupColumn = "point";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);

        // filterPointsByPeriod(data, "pointsData_17_02_period", "-1800", "point", "points").addTo(step_800_1);
        // filterPointsByPeriod(data, "pointsData_17_02_period", "1800-1850", "point", "points").addTo(step_800_850_1);
        // filterPointsByPeriod(data, "pointsData_17_02_period", "1850-1900", "point", "points").addTo(step_850_900_1);
        // filterPointsByPeriod(data, "pointsData_17_02_period", "1900-1921", "point", "points").addTo(step_900_920_1);
    });



//щоб передати змнну у кожен клік
function onEachFeatureClosure(defaultColor, weightValue) {
    return function onEachFeature(feature, layer) {
        // layer.on('mouseover', function (e) {  e.target.setStyle(mouseoverStyle); });
        // layer.on('mouseout', function (e) {  e.target.setStyle({ color: defaultColor, weight: weightValue }); });
        var popup;
        if(feature.properties.picture != ".jpg"){
            popup = '<p> ' +
                'id:'+feature.properties.id+ " <br> <b>" +
                "назва: " + feature.properties.name+ "</b><br>"+
                "рік побудови: " + feature.properties.year + "<br>"+
                "<img style='max-width: 200px;' src='img/tips/" +feature.properties.picture +"'/>" + '<br> ' +
                feature.properties.info +"<br>"+
                '</p>'
        } else {
            popup = '<p> ' +
                'id:'+feature.properties.id+ " <br> <b>" +
                "назва: " + feature.properties.name+ "</b><br>"+
                "рік побудови: " + feature.properties.year + "<br>"+
                feature.properties.info +"<br>"+
                '</p>'
        }

        layer.bindPopup(popup);
    }
}

function returnPreviousStyle(layer) {
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


    if(r.index === 5 && r.direction === "down"){
        for(let l in layerGroups) {
            eval(layerGroups[l]).eachLayer(function(f){
                for (let i=0; i < f.getLayers().length; i++) {
                    let current = f.getLayers()[i].feature.properties.id;
                    if(current === "L000000004" || current === "L000000003"){
                        f.getLayers()[i].setStyle({opacity: 0});
                        f.getLayers()[i].off('click');
                    }

                }
            });
        }
    }


    if(r.index === 5 && r.direction === "up"){
        for(let l in layerGroups) {
            eval(layerGroups[l]).eachLayer(function(f){
                for (let i=0; i < f.getLayers().length; i++) {
                    let current = f.getLayers()[i].feature.properties.id;
                    if(current === "L000000004" || current === "L000000003"){
                        f.getLayers()[i].resetStyle(eval(layerGroups[l]));

                    }

                }
            });
        }
    }





        if(r.index >= 10) {
            map.flyTo([49.422, 27.02], 14);
        }


    // }
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