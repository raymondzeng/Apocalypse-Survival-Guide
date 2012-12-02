var map;
var geocoder;
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var styles;
var minZoomLevel = 10;
var maxZoomLevel = 19;
var searchResults = [];

var index = 0;
var text = "My name is Robert Neville. I am a survivor living in New York City. I am broadcasting on all AM frequencies. I will be at the South Street Seaport everyday at mid-day, when the sun is highest in the sky. If you are out there... if anyone is out there... I can provide food, I can provide shelter, I can provide security. If there's anybody out there... anybody... please. You are not alone.";

var strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.473069,-74.31015), 
    new google.maps.LatLng(40.922852,-73.693542)
);

$(document).ready(function(){
    $("#trigger").click(function(){
	$("#panel").toggle("fast");
	return false;
    });
    $('#address').keydown(function(){
	if(event.keyCode == 13)
	    codeAddress();
    });
    $('#start, #end').keydown(function(){
	if(event.keyCode == 13)
	    calcRoute();
    });   
    $('#message').click(function(){
	codeAddress('South Street Seaport');
    });
    $('#bmessage').click(function(){
	type();
	$('#bmessage').html('<span class="icon medium darkgray" data-icon="9" style="display: inline-block"><span aria-hidden="true">9</span></span></span> (0) Incoming Message');
    });
});


//GOOGLE API
function initialize(){
    geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var latlng = new google.maps.LatLng(40.720461,-74.013519);
    var mapOptions = {
	zoom: minZoomLevel,
	center: new google.maps.LatLng(40.720461,-74.013519),
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
			      mapOptions);
    directionsDisplay.setMap(map);

    google.maps.event.addListener(map, 'zoom_changed', function() {
	if(map.zoom < minZoomLevel) map.setZoom(minZoomLevel);
	if(map.zoom > maxZoomLevel) map.setZoom(maxZoomLevel);
    });

    google.maps.event.addListener(map, 'dragend', function() {
	if (strictBounds.contains(map.getCenter())) return;
	var c = map.getCenter(),
        x = c.lng(),
        y = c.lat(),
        maxX = strictBounds.getNorthEast().lng(),
        maxY = strictBounds.getNorthEast().lat(),
        minX = strictBounds.getSouthWest().lng(),
        minY = strictBounds.getSouthWest().lat();
	
	if (x < minX) x = minX;
	if (x > maxX) x = maxX;
	if (y < minY) y = minY;
	if (y > maxY) y = maxY;
	
	map.setCenter(new google.maps.LatLng(y, x));
    });
    
    var input = document.getElementById('target');
    var searchBox = new google.maps.places.SearchBox(input);
    var markers = [];
    
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }
	
        markers = [];
        var bounds = new google.maps.LatLngBounds();
	for (var i = 0, place; place = places[i]; i++) {
	    var temp = {"name": place.name,
			"address": place.formatted_address
		       };
	    searchResults.push(temp);
	    
	    var marker = new google.maps.Marker({
		map: map,
		title: place.name,
		animation: google.maps.Animation.DROP,
		position: place.geometry.location
            });
 
	    markers.push(marker);
	    
           bounds.extend(place.geometry.location);
        }
	
        map.fitBounds(bounds);
    });
    
   google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

}   

function changeMS(str){
    if(str === 'zombies'){
	styles = [
	    {
		stylers: [
		    { "hue": "#ff2b00"},
		    { "saturation": -7 }
		]
	    }];
    }
    else if(str === 'aliens'){
	styles = [
	    {
		stylers: [
		    { "hue": "#08ff00"},
		    { "saturation": -52 }
		]
	    }];
    }
    else{
	styles = [];
    }
    map.setOptions({styles: styles});
}
function codeAddress(str) {
    if(str == null){
	var address = document.getElementById('address').value;
	geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
		map.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
		    animation: google.maps.Animation.DROP,
		    map: map,
                    position: results[0].geometry.location
		});
            } else {
		alert('Geocode was not successful for the following reason: ' + status);
            }
	});
    }
    else{
	var address = str;
	geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
		map.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
		    animation: google.maps.Animation.DROP,
                    map: map,
                    position: results[0].geometry.location
		});
            } else {
		alert('Geocode was not successful for the following reason: ' + status);
            }
	});
    }
    map.setZoom(15);
}

function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var selectedMode = document.getElementById('mode').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode[selectedMode]
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

// END GOOGLE STUFF

function type(){
    document.getElementById('message').innerHTML += text.charAt(index);
    index += 1;
    var t = setTimeout('type()',50);
}

function changeBGC(str){
    if(str==='aliens'){
	$('#radiomessage').css('display','none');
	$('#disaster').text('Alien Invasion');
	$('#wheel').css('display','inline');
	$('#wheel').carousel('cycle');
	$('body,html,#map_canvas').css('background','-webkit-linear-gradient(-45deg, #aebcbf 0%,#6e7774 50%,#0a0e0a 51%,#0a0809 100%)');
	changeMS('aliens');
    }
    else if(str==='fire'){
	$('#radiomessage').css('display','none');
	$('#wheel').css('display','none');
	$('body,html,#map_canvas').css('background','-webkit-linear-gradient(-45deg, #fceabb 0%,#fccd4d 50%,#f8b500 51%,#fbdf93 100%)');
	changeMS('fire');
    }
    else if(str==='hurricane'){
	$('#radiomessage').css('display','none');
	$('#wheel').css('display','none');
	$('#disaster').text('Hurricane');
	$('body,html,#map_canvas').css('background','-webkit-linear-gradient(-45deg, #6db3f2 0%,#54a3ee 50%,#3690f0 51%,#1e69de 100%)');
	changeMS('hurricane');
    }
    else{
	$('#radiomessage').css('display','inline');
	$('#wheel').css('display','none');
	$('#disaster').text('Zombie Apocalypse');
	$('body,html,#map_canvas').css('background','-webkit-linear-gradient(-45deg, #bfd255 0%,#8eb92a 50%,#72aa00 51%,#9ecb2d 100%)');
	$('body,html,#map_canvas').css('background','-webkit-linear-gradient(45deg, rgba(191,210,85,1) 0%,rgba(142,185,42,1) 85%,rgba(158,203,45,1) 100%)');
	changeMS('zombies');
    }
}