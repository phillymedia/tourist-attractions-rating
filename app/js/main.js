$(document).ready(function() {});

var data = require("./data.json")
var text = require("../text.json")


var map = L.map('map').setView([
    39.9526, -75.1652
], 14);

// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}' + (
//     L.Browser.retina
//     ? '@2x'
//     : '') + '.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'}).addTo(map);

map.scrollWheelZoom.disable();

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + (
L.Browser.retina
? '@2x'
: '') + '.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

var icon = L.divIcon({
    className: 'icon',
    iconSize: 22,
    iconAnchor: [11, 22],
    html: '<i class="fas fa-certificate"></i>'
});

var icon2 = L.divIcon({
    className: 'icon2',
    iconSize: 30,
    iconAnchor: [15, 30],
    html: '<i class="fas fa-map-marker-alt"></i>'
});

// var geojson = L.geoJson(data, {
// 	pointToLayer: function(feature, latlng) {
//         return L.marker(latlng, {
//             icon: icon
//         })
//     }
// }).addTo(map)

// var geojson2 = L.geoJson(text, {
// 	pointToLayer: function(feature, latlng) {
//         return L.marker([feature.lat, feature.long], {
//             icon: icon
//         })
//     }
// }).addTo(map);
var tileURL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + (
L.Browser.retina
? '@2x'
: '') + '.png';
var allmarkers = L.featureGroup();
text.forEach(function(r,i){
	L.marker([r.lat, r.long], {icon: icon}).addTo(allmarkers);
    var mapName = 'lilMap'+ (i+1);

    if($(`#${mapName}`).length > 0) {
            L.map(mapName).setView([r.lat, r.long], 15).addLayer(L.tileLayer(tileURL)).addLayer(L.marker([r.lat, r.long], {icon: icon2}));
    }
})

allmarkers.addTo(map)

map.fitBounds(allmarkers.getBounds())



$(".leaflet-marker-icon.icon").each(function(r,i){
	$(this).append(`<span class="iconlabel">${r+1}</span>`)
})
