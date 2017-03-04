/**
 * Created by vsmysle on 3/4/17.
 */
$( document ).ready(function(){
    var myStyle = {
        "color": "#00040a",
        "weight": 5,
        "opacity": 0
    };
    //var crs = new L.Proj.CRS('EPSG:27700',
    //'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
    //{
    //    resolutions: [1600,800,400,200,100,50,25,10,5,2.5,1,0.5,0.25,0.125,0.0625]
    //});

    var mapboxAccessToken = "pk.eyJ1IjoidnNteXNsZSIsImEiOiJjaXp2aHN1YnQwMDBnMnFwbms0c3JlZnJyIn0.by1qV2ysk6yiAFCc-ADnyQ";
    var map = new L.Map('map_container', {
         crs: L.CRS.EPSG3857,
         center: [58.598014, 25.015606],
         zoom: 8
    //    crs: crs,
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    }).addTo(map);
    var featureCollection = {
        type: 'FeatureCOllection',
        features: []
    };


    map.setView([58.598014, 25.015606], 8);
    $.getJSON($SCRIPT_ROOT+"/get_full_data", function (data) {
        console.log("here");
        var geojson = data['geo_data'];
        console.log(geojson['features'])
        ;
        L.geoJSON(geojson['features'], {
            style:myStyle
        }).addTo(map);
        console.log(geojson['type']);
        console.log("all is ok !")
    });
});