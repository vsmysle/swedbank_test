/**
 * Created by vsmysle on 3/4/17.
 */

var GLOBAL_START = "";
var GLOBAL_END = "";

function getColor(d) {
	var sector = 481520.17840796;
    return d > 491013 ? '#4B0B0C' :
           d > 218732 ? '#72100F' :
           d > 42151 ? '#A10C0E' :
           d > 6437 ? '#CD1014' :
           d > 3300 ? '#FF191F' :
           d > 1777 ? '#FB5A60' :
           d > 0 ? '#FEA3A2' :
                      '#FCC0C0';
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
            },
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
