
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
var canvasRenderer = L.canvas();

const layerGroups = [
    "novoekonom_step", "grod_step"

];


/*створюємо шари на всі scrolling steps */
var novoekonom_step = new L.LayerGroup(),
    grod_step = new L.LayerGroup();



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

function filterByPeriod(data, filter_property, period, popup, style, id_value) {
    if (id_value === "points") {
        return L.geoJson(data, {
            id: id_value,
            filter: function (feat) { return feat.properties[filter_property] == period },
            renderer: canvasRenderer,
            onEachFeature: onEachFeatureClosure("green", 1),
            pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, geojsonMarkerOptions); },
            style: function () { return geojsonMarkerOptions }

        });

    } else {
        return L.geoJson(data, {
            id: id_value,
            filter: function (feat) { return feat.properties[filter_property] == period },
            renderer: canvasRenderer,
            onEachFeature: onEachFeatureClosure("green", 1),

            style: function () { return style }
        });
    }
}

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



//підсвітка кількох будівель одночасно (ДОСИ, Курчатова тощо)
function loopOnMultiple(currentStep, array) {
    pulseLayer.clearLayers();
    array.forEach(function (el) {
        let thisId = el;
        eval(currentStep).eachLayer(function (layer) {
            for (let i = 0; i < layer.getLayers().length; i++) {
                let current = layer.getLayers()[i].feature.properties.id;
                if (current.toString() === thisId.toString()) {
                    const pulsatingIcon = generatePulsatingMarker(10, 'orange');
                    L.marker(layer.getLayers()[i].getBounds().getCenter(), { icon: pulsatingIcon }).addTo(pulseLayer);
                    pulseLayer.addTo(map);

                }
            }
        });
    })
}


//підсвітка будівель
function loopOnBuilding() {
    let thisId = $(this).data("details")[1];
    let currentLayer = $(this).data("details")[0];
    eval(currentLayer).eachLayer(function (layer) {
        for (let i = 0; i < layer.getLayers().length; i++) {
            let current = layer.getLayers()[i].feature.properties.id;
            if (current.toString() === thisId.toString()) {
                pulseLayer.clearLayers();
                const pulsatingIcon = generatePulsatingMarker(10, 'orange');
                L.marker(layer.getLayers()[i].getBounds().getCenter(), { icon: pulsatingIcon }).addTo(pulseLayer);
                pulseLayer.addTo(map);

            }
        }
    });
}


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

$(".highlight-building")
    .on("mouseover", loopOnBuilding)
    .on("mouseout", loopOut);

$('.highlight-officer')
    .on("mouseover", function () {
        loopOnMultiple("step_900_920_3", ["39450196", "39450197", "130541840", "130541849", "189209006", "130541852", "202318663", "252744668", "587491806"])
    })
    .on("mouseout", function () { pulseLayer.clearLayers(); });
//step_1900-1920_3

$('.highlight-kurchatova')
    .on("mouseover", function () {
        loopOnMultiple("step_970_980_1", ["134126155", "134126167", "134126159", "134126154", "134126156"])
    })
    .on("mouseout", function () { pulseLayer.clearLayers(); });

$('.highlight-sixteen')
    .on("mouseover", function () {
        loopOnMultiple("step_970_980_1", ["191799585", "p000000016"]);
    })
    .on("mouseout", function () { pulseLayer.clearLayers(); });


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

$("#show-1951")
    .on("mouseover", function () { $("#plan_1951").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#plan_1951").hide(); });

$("#show-1960")
    .on("mouseover", function () { $("#plan_1960").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#plan_1960").hide(); });

$("#show-coat")
    .on("mouseover", function () { $("#coat").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#coat").hide(); });

$("#show-coat2")
    .on("mouseover", function () { $("#coat2").css("display", "flex").hide().fadeIn(500); })
    .on("mouseout", function () { $("#coat2").hide(); });

$("#show-diploma")
    .on("mouseover", function () { $("#diploma").css("display", "flex").show() })
    .on("mouseout", function () { $("#diploma").hide(); });

$("#show-zamok")
    .on("mouseover", function () { $("#zamok").css("display", "flex").show() })
    .on("mouseout", function () { $("#zamok").hide(); });





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






// це якщо треба додати можливість вмикати/вимикати шари
var layerControl = L.control.layers().addTo(map);
layerControl.addOverlay("step_800_1", "step_800_2", "security_problem", "natural_water_osm");


