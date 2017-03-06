/**
 * Created by vsmysle on 3/4/17.
 */

var GLOBAL_START = "";
var GLOBAL_END = "";

function getColor(d) {
	var sector = 481520.17840796;
    return d > 491013 ? '#800026' :
           d > 218732 ? '#BD0026' :
           d > 42151 ? '#E31A1C' :
           d > 6437 ? '#FC4E2A' :
           d > 3300 ? '#FD8D3C' :
           d > 1777 ? '#FEB24C' :
           d > 0 ? '#FED976' :
                      '#FFEDA0';
}

function createRangePicker(data, map, layer){
    $('.btn').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        },
        "minDate": GLOBAL_START,
        "maxDate": GLOBAL_END,
        "drops": "up",
        "opens": "left"
    }, function (start, end, label) {
        $.getJSON($SCRIPT_ROOT + "/get_data_filtered", {
            start: start.format("DD.MM.YYYY"),
            end: end.format("DD.MM.YYYY")
        }, function (new_data) {
            map.removeLayer(layer);
            drawVisualization(new_data, map);
        });
    });
};


function drawVisualization(data, map) {
        var data_geojson = data.geo_data;
        var stat_geojson = data.stat_data;
        var fancy_night_dress = L.geoJSON(data_geojson.features, {
            onEachFeature: function (feature, layer) {
                var sihtnumber = feature.properties.sihtnumber;
                layer.bindPopup(feature.properties.sihtnumber);
                layer.on("mouseover", function (e) {
                    if (sihtnumber in stat_geojson) {
                        $("#info_bar").empty().append("Zip: " + sihtnumber +
                            " | Population: " + Math.round(stat_geojson[sihtnumber][2]) +
                            " | Total Salary: " + Math.round(stat_geojson[sihtnumber][0]) +
                            " | Average Salary: " + Math.round(stat_geojson[sihtnumber][1]));
                    } else {
                        $("#info_bar").empty().append("Zip: " + sihtnumber);
                    }
                })
            },
            style: function (feature) {
                var sihtnumber = feature.properties.sihtnumber;
                if (sihtnumber in stat_geojson) {
                    return {
                        weight: 0.3,
                        opacity: 1,
                        fillOpacity: 0.3,
                        color: getColor(stat_geojson[sihtnumber][2])
                    }
                } else {
                    return {
                        weight: 0.3,
                        fillOpacity: 0.3,
                        opacity: 0.1,
                        color: "white"
                    }
                }
            }
        }).addTo(map);
        createRangePicker(data, map, fancy_night_dress);
}


$( document ).ready(function() {
    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = new L.Map('map_container', {
        crs: L.CRS.EPSG3857,
        center: [58.598014, 25.015606],
        zoom: 8
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {}).addTo(map);
    $.getJSON($SCRIPT_ROOT + "/get_full_data", function (data) {
        GLOBAL_START = data['date_range'][0];
        GLOBAL_END = data['date_range'][1];
        drawVisualization(data, map);
    });
});
