/**
 * Created by vsmysle on 3/4/17.
 */
$( document ).ready(function(){
    // var myStyle = {
    //
    //
    // };
    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = L.map('map_container', {
        center: [58.598014, 25.015606],
        zoom: 8
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
        id: 'mapbox.light'
    }).addTo(map);
    // $.getJSON($SCRIPT_ROOT+"/get_full_data", function (data) {
    //     var geojson = data['geo_data'];
    //     geojson.addTo(map);
    // });
});