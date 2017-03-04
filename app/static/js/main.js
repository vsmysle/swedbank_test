/**
 * Created by vsmysle on 3/4/17.
 */
$( document ).ready(function(){
    var myStyle = {
        "color": "#00040a",
        "weight": 2,
        "fill": "black",
        "opacity": 0.1
    };

    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = new L.Map('map_container', {
        crs: L.CRS.EPSG3857,
        center: [58.598014, 25.015606],
        zoom: 8
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    }).addTo(map);

    $.getJSON($SCRIPT_ROOT+"/get_full_data", function (data) {
        console.log("here");
        var geojson = data.geo_data;
        console.log(geojson['features'])
        ;
        L.geoJSON(geojson.features, {
            style:myStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.sihtnumber);
            }
        }).addTo(map);

    });
});