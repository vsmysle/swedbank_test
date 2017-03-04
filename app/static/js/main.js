/**
 * Created by vsmysle on 3/4/17.
 */
$( document ).ready(function(){
    $.getJSON($SCRIPT_ROOT+"/get_data", function (data) {
        var map = L.map('mapid');
        var geoJsonFeature = data;
        console.log(data['type']);
        L.geoJSON(geoJsonFeature).add(mapid);
    })
});