/**
 * Created by vsmysle on 3/4/17.
 */

function getColor(d) {
    return d > 2700 ? '#4B0B0C' :
           d > 2600 ? '#72100F' :
           d > 2550 ? '#A10C0E' :
           d > 2500 ? '#CD1014' :
           d > 2450 ? '#FF191F' :
           d > 2400 ? '#FB5A60' :
           d > 2350 ? '#FEA3A2' :
                      '#FCC0C0';
}

function createRangePicker(data, map){
    $('input[name="datefilter"]').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        },
        "startDate": data['date_range'][0],
        "endDate": data['date_range'][1],
        "drops": "up"
    }, function (start, end, label) {
        $.getJSON($SCRIPT_ROOT + "/get_data_filtered", {
            start: start.format("DD.MM.YY"),
            end: end.format("DD.MM.YY")
        }, function (data) {
            drawVisualization(data, map);
        });
    });
};


function drawVisualization(data, map) {
        var data_geojson = data.geo_data;
        var stat_geojson = data.stat_data;
        L.geoJSON(data_geojson.features, {
            onEachFeature: function (feature, layer) {
                var sihtnumber = feature.properties.sihtnumber;
                layer.bindPopup(feature.properties.sihtnumber);
                layer.on("mouseover", function (e) {
                    if (sihtnumber in stat_geojson) {
                        $("#info_bar").empty().append("Zip:" + sihtnumber +
                            "| Population:" + Math.round(stat_geojson[sihtnumber][2]) +
                            "| Total Salary:" + Math.round(stat_geojson[sihtnumber][0]) +
                            "| Average Salary:" + Math.round(stat_geojson[sihtnumber][1]));
                    } else {
                        $("#info_bar").empty().append("Zip:" + sihtnumber);
                    }
                })
            },
            style: function (feature) {
                var sihtnumber = feature.properties.sihtnumber;
                if (sihtnumber in stat_geojson) {
                    return {
                        weight: 1,
                        color: getColor(stat_geojson[sihtnumber][2])
                    }
                } else {
                    return {
                        weight: 1,
                        color: "black"
                    }
                }
            }
        }).addTo(map);
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
        drawVisualization(data, map);
        createRangePicker(data, map);
    });
});
