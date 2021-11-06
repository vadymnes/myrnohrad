
// Map


var default_coordinates = [48.30, 37.30];
var default_zoom = window.innerWidth < 813 ? 13 : 14;

var map = L.map('map').setView(default_coordinates, 11);


L.tileLayer(
    // 'https://api.mapbox.com/styles/v1/evgeshadrozdova/ckl1654or031r17mvc4wr7edc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ',

    //красива, але у stamen недекомунізовані вулиці
    //'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}',

    //резервна підложка, якщо mapbox вибере ліміт
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        ext: 'png'
    }).addTo(map);

map.scrollWheelZoom.disable();

const layerGroups = [
    "novoekonom_step_1", "grod_step_2"

];


/*створюємо шари на всі scrolling steps */
var novoekonom_step_1 = new L.LayerGroup(),
    grod_step_2 = new L.LayerGroup();



var pulseLayer = new L.LayerGroup();

var buildingsColor = "#9d2f32", //"#f14633", //"#9d2f32",
    polygonsFillColor = "#A7718D",//"#c9d3b3", //"#899e91", //"#bbcda9", // "#fce0bc", //"#899e91", //"#a79d70",
    linesColor = '#718A8C', //"#0089C0", //'#4783fe',
    pointsColor = "#ff9d04",//'#D7A319';
    polygonsStrokeColor = '#CE4066'; //'#374969'

//визначаємо стилі для кожного типу елементів
var polygonsFillStyle = {
    weight: 1,
    //fillOpacity: 1,
    opacity: 1,
    fillColor: polygonsFillColor,
    color: polygonsFillColor
};

var polygonsColorStyle = {
    weight: 2,
    opacity: 1,
    fillColor: "transparent",
    color: polygonsStrokeColor,
    dashArray: '5, 5',
    dashOffset: '0'
};



var linesStyle = {
    color: linesColor,
    opacity: 1
};


// стиль для маркерів
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


//функція, якою ми розкидаємо всі наші обʼєкти відповідно до зазначеного в них кроку
function scatterToLayers(df, stepColumn, popupColumn, style, layer_id) {
    filterByPeriod(df, stepColumn, "novoekonom_step", popupColumn, style, layer_id).addTo(novoekonom_step_1);
    filterByPeriod(df, stepColumn, "grod_step", popupColumn, style, layer_id).addTo(grod_step_2);



}

fetch("data/precity.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        let layer_id = "polygonsC";
        let stepColumn = "step";
        let style = polygonsColorStyle;
        let popupColumn = "name";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });

fetch("data/polygonsData_4326_color.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        let layer_id = "polygonsC";
        let stepColumn = "step";
        let style = polygonsColorStyle;
        let popupColumn = "polygon";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });

fetch("data/natural_water_osm.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        let layer_id = "polygonsF";
        let stepColumn = "step";
        let style = polygonsFillStyle;
        let popupColumn = "info";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });

fetch("data/problems_human_security.geojson")
    .then(function (response) { return response.json() })
    .then(function (data) {

        let layer_id = "points";
        let stepColumn = "step";
        let style = geojsonMarkerOptions;
        let popupColumn = "point";

        scatterToLayers(data, stepColumn, popupColumn, style, layer_id);
    });




function loopOn() {
    let thisId = $(this).data("details")[1];
    let currentLayer = $(this).data("details")[0];
    eval(currentLayer).eachLayer(function (layer) {
        for (let i = 0; i < layer.getLayers().length; i++) {
            let current = layer.getLayers()[i].feature.properties.id;
            if (current.toString() === thisId.toString()) {
                layer.getLayers()[i].setStyle(mouseoverStyle);
            }
        }
    });
}

function loopOut() {
    let thisId = $(this).data("details")[1];
    let currentLayer = $(this).data("details")[0];
    let steplayer = $(this).closest(".step").data("stuff")[0];
    map.removeLayer(pulseLayer);
    if (steplayer === currentLayer) {
        eval(currentLayer).eachLayer(function (layer) {
            for (let i = 0; i < layer.getLayers().length; i++) {
                let current = layer.getLayers()[i].feature.properties.id;
                if (current.toString() === thisId.toString()) {
                    returnPreviousStyle(layer);
                }
            }

        });
    } else {
        eval(currentLayer).eachLayer(function (layer) {
            for (let i = 0; i < layer.getLayers().length; i++) {
                let current = layer.getLayers()[i].feature.properties.id;
                if (current.toString() === thisId.toString()) {
                    layer.getLayers()[i].setStyle(toGreyStyle);
                }
            }

        });
    }

}

$(".highlight")
    .on("mouseover", loopOn)
    .on("mouseout", loopOut);




//показуємо картинки по наведенню
$("#show-1800")
    .on("mouseover", function () { $("#plan_1800").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#plan_1800").hide(); });

$("#show-dymytrov")
    .on("mouseover", function () { $("#dymytrov_map").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#dymytrov_map").hide(); });

$("#show-population")
    .on("mouseover", function () { $("#population").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#population").hide(); });

$("#show-demography")
    .on("mouseover", function () { $("#demography").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#demography").hide(); });


//щоб передати змнну у кожен клік
function onEachFeatureClosure(defaultColor, weightValue) {
    return function onEachFeature(feature, layer) {
        layer.on('click', function (e) { });
        let name = feature.properties.name != "Null" ? feature.properties.name : "невідомо";
        let info = feature.properties.info != "Null" ? feature.properties.info : "";
        let picture = feature.properties.photo != "Null" ? "<img style='display: block; width: 90%; margin:10px auto;' src='img/tips/" + feature.properties.photo + "'/>" : "";
        let year = feature.properties.year != "Null" ? " (" + feature.properties.year + ") " : "";

        var popup = picture + '<p>' +
            //'id:'+feature.properties.id+ " <br> <b>" +
            "<b>" + name + "</b>" + year.replace(".0", '') + "<br>" + '<br> ' + info + "<br>" +
            '</p>';

        layer.bindPopup(popup);
    }
}





//прибираємо обʼєкти на скрол - функція
function removeObjectsWhenScrollDown(objArray) {
    for (let l in layerGroups) {
        eval(layerGroups[l]).eachLayer(function (f) {
            for (let i = 0; i < f.getLayers().length; i++) {
                let current = f.getLayers()[i].feature.properties.id;
                if (objArray.includes(current)) {
                    f.getLayers()[i].setStyle({ opacity: 0, fillOpacity: 0 });
                    //f.getLayers()[i].off('click');
                }

            }
        });
    }
}

//повертаємо обʼєкти на скрол - функція
function returnObjectsWhenScrollUp(objArray) {
    for (let l in layerGroups) {
        eval(layerGroups[l]).eachLayer(function (f) {
            for (let i = 0; i < f.getLayers().length; i++) {
                let current = f.getLayers()[i].feature.properties.id;
                if (objArray.includes(current)) {
                    //f.getLayers()[i].resetStyle(eval(layerGroups[l]));
                }

            }
        });
    }
}


function returnPreviousStyle(layer) {
    var pane = layer.options.id;
    if (pane === "polygonsC") {
        layer.setStyle(polygonsColorStyle);
    } else if (pane === "lines") {
        layer.setStyle(linesStyle);
    } else if (pane === "points") {
        layer.setStyle(geojsonMarkerOptions);
    } else if (pane === "polygonsF") {
        layer.setStyle(polygonsFillStyle);
    }
}


var container = $('#scroll');
var graphic = $('#scroll > .scroll__graphic'); //container.select('.scroll__graphic');
var text = $('#scroll > .scroll__text'); //container.select('.scroll__text');
var step = $('#scroll > .scroll__text > .step'); // text.selectAll('.step');
var scroller = scrollama();


// scrollama event handlers
function handleStepEnter(r) {

    let layerToAdd = $(r.element).data("stuff")[0];
    let layerToRemove = $(r.element).data("stuff")[1];
    let layerToGrey = $(r.element).data("stuff")[2];


    //всі кроки окрім першого та останнього
    if (r.direction === "down" && layerToGrey != 'none') {
        eval(layerToAdd).addTo(map);
        eval(layerToGrey).eachLayer(function (layer) { layer.setStyle(toGreyStyle); });
    } else if (r.direction === "down" && layerToGrey === 'none') {
        eval(layerToAdd).addTo(map);
    } else if (r.direction === "up" && layerToRemove != 'none') {
        map.removeLayer(eval(layerToRemove));
        eval(layerToAdd).eachLayer(function (layer) { returnPreviousStyle(layer) });
    }


    // крок 3
    if (r.index === 3 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000022"]);
    }

    if (r.index === 3 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000022"]);
    }

    // крок 5
    if (r.index === 5 && r.direction === "down") {
        removeObjectsWhenScrollDown(["L000000004", "L000000003"]);
    }

    if (r.index === 5 && r.direction === "up") {
        returnObjectsWhenScrollUp(["L000000004", "L000000003"]);
    }


    // крок 6
    if (r.index === 6 && r.direction === "down") {
        removeObjectsWhenScrollDown(["L000000046", "L000000055", "L000000008", "L000000060",
            "L000000061", "L000000065", "L000000070", "L000000078", "L000000079", "L000000080"]);
    }

    if (r.index === 6 && r.direction === "up") {
        returnObjectsWhenScrollUp(["L000000046", "L000000055", "L000000008", "L000000060", "L000000061",
            "L000000065", "L000000070", "L000000078", "L000000079", "L000000080"]);
    }

    // крок 8
    if (r.index === 8 && r.direction === "down") {
        removeObjectsWhenScrollDown(["L000000081"]);
    }

    if (r.index === 8 && r.direction === "up") {
        returnObjectsWhenScrollUp(["L000000081"]);
    }

    // крок 9
    if (r.index === 9 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000053", "30"]);
    }

    if (r.index === 9 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000053", "30"]);
    }

    // крок 13
    if (r.index === 13 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000013"]);
    }

    if (r.index === 13 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000013"]);
    }

    // крок 14
    if (r.index === 14 && r.direction === "down") {
        removeObjectsWhenScrollDown(["L000000082", "p000000027"]);
    }

    if (r.index === 14 && r.direction === "up") {
        returnObjectsWhenScrollUp(["L000000082", "p000000027"]);
    }

    // крок 16
    if (r.index === 16 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000067", "c000000068"]);
    }

    if (r.index === 16 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000067", "c000000068"]);
    }

    // крок 17
    if (r.index === 17 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000059", "c000000028", "c000000029"]);
    }

    if (r.index === 17 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000059", "c000000028", "c000000029"]);
    }

    // крок 21
    if (r.index === 21 && r.direction === "down") {
        removeObjectsWhenScrollDown(["c000000021"]);
    }

    if (r.index === 21 && r.direction === "up") {
        returnObjectsWhenScrollUp(["c000000021"]);
    }


    if (r.index === 3) {
        map.flyTo(default_coordinates, default_zoom);
    }

    if (r.index >= 16 && r.direction === "down") {
        map.flyTo(default_coordinates, 13);
    }

    if (r.index === 15 && r.direction === "up") {
        map.flyTo(default_coordinates, default_zoom);
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


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

function flyTo(coordinates) {
    map.flyTo(coordinates, default_zoom);
}

function flyOut() {
    map.flyTo(default_coordinates, default_zoom);
}


