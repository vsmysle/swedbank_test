/**
 * Created by vsmysle on 3/4/17.
 */

function getColor(d) {
    return d > 2700 ? '#800026' :
           d > 2600 ? '#BD0026' :
           d > 2550 ? '#E31A1C' :
           d > 2500 ? '#FC4E2A' :
           d > 2450 ? '#FD8D3C' :
           d > 2400 ? '#FEB24C' :
           d > 2350 ? '#FED976' :
                      '#FFEDA0';
}

$( document ).ready(function() {
    var polygonStyle = {
        "color": "#00040a",
        "weight": 2,
        "fillColor": "black",
        "opacity": 0.1
    };
    var multiPolygonStyle = {
        "color": "red",
        "weight": 2,
        "fillColor": "red",
        "opacity": 0.1
    };



    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = new L.Map('map_container', {
        crs: L.CRS.EPSG3857,
        center: [58.598014, 25.015606],
        zoom: 8
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {}).addTo(map);
    $.getJSON($SCRIPT_ROOT + "/get_full_data", function (data) {
        var data_geojson = data.geo_data;
        var stat_geojson = data.stat_data;
        L.geoJSON(data_geojson.features, {
            onEachFeature: function (feature, layer) {
                var sihtnumber = feature.properties.sihtnumber;
                layer.bindPopup(feature.properties.sihtnumber);
                layer.on("mouseover", function (e) {
                    if (sihtnumber in stat_geojson){
                        $("#info_bar").empty().append("Zip:"+sihtnumber+
                            "| Population:"+ Math.round(stat_geojson[sihtnumber][2])+
                            "| Total Salary:"+ Math.round(stat_geojson[sihtnumber][0])+
                            "| Average Salary:" + Math.round(stat_geojson[sihtnumber][1]));
                    }else{
                       $("#info_bar").empty().append("Zip:"+sihtnumber);
                    }
                })
            },
            style: function (feature) {
                //switch (feature.geometry.type) {
                //case 'MultiPolygon':
                //        return {color: "#ff0000"};
                //    case 'Polygon':
                //        return {color: "#0000ff"};
                //}
                var sihtnumber = feature.properties.sihtnumber;
                if (sihtnumber in stat_geojson) {
                    return {color: getColor(stat_geojson[sihtnumber][2])}
                }
            }
        }).addTo(map);
    });

    $("#menu-close").click(function(e) {
        e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });
  $("#menu-toggle").click(function(e) {
        e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });
});
