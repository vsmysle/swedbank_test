/**
 * Created by vsmysle on 3/4/17.
 */
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

var geojson = new L.geoJson();
geojson.addTo(map);

$( document ).ready(function(){
    $.getJSON($SCRIPT_ROOT+"/get_full_data", function (data) {

    });
    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = L.map('mapid', {
        center: [51.505, -0.09],
        zoom: 13
    });
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
            id: 'mapbox.light'
        }).addTo(map);

        var feature = data['geo_data'];
        console.log(data['geo_data']);
        L.GeoJSON.AJAX(data, {
            style: function (feature) {
                return {color: feature.properties.color};
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.description;
        }).addTo(map);
    })
});