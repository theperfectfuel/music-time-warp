$(document).ready(function() {

	var menuToggle = $('#js-mobile-menu').unbind();
	$('#js-navigation-menu').removeClass("show");


	menuToggle.on('click', function(e) {
		e.preventDefault();
		$('#js-navigation-menu').slideToggle(function(){
			if($('#js-navigation-menu').is(':hidden')) {
				$('#js-navigation-menu').removeAttr('style');
			}
		});
	});


	$('#year-list').change(function() {
		var year = $('#year').val();
		var text = $("#year option:selected").text();
		$('#year-display').append('<div class="decades">The '+text+'</div>');
		getArtists(year);
	});

	$('#year-list').submit(function(e) {
		e.preventDefault();
		clearOverlays();
	});

}); // close ready function

// Global variables for map functionality
var artistSet = [];
var map;
var styledMapType;
var mc;
var geocoder;
var coords_obj;
var markers = [];
var markerInfo = [];
var infoWindows = [];
var center = {lat: 37.397, lng: -100.644};

// MAP INITIALIZATION FUNCTION
function initMap() {

	// variable to style the google map
	var styles = [
		{
			featureType: 'water',
			elementType: 'geometry.fill',
			stylers: [
				{color: '#a1e6f7'},
				//{color: '#E8CCC4'},
				{invert_lightness: false}
			]
		},{ 
			featureType: 'water', 
			elementType: 'labels', 
			stylers: [ 
				{invert_lightness: false}, 
				{hue: '#ffffff'} 
			] 
		},{
			featureType: 'landscape.natural.landcover',
			elementType: 'geometry.fill',
			stylers: [
				{hue: '#ddbcae'},
				//{hue: '#EBDFDF'},
				{lightness: 1}
			]
		}
	];

	// sets the center for roughly the center of the US
	var bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(25.82, -124.39),
		new google.maps.LatLng(49.38, -66.94)
	);

	var mapOptions = {

		mapTypeControlOptions: {
			mapTypeIds: ['Styled']
		},
			bounds: bounds,
			//center: {lat: 37.397, lng: -100.644},
			//zoom: 4,
			scrollwheel: true,
			draggable: true,
			disableDefaultUI: false,
			mapTypeId: 'Styled'
	};

	var mapDiv = $('#map_canvas')[0];

	map = new google.maps.Map(mapDiv, mapOptions);
	styledMapType = new google.maps.StyledMapType(styles, {name: 'Styled'});
	map.mapTypes.set('Styled', styledMapType);

	map.fitBounds(bounds);

	mc = new MarkerClusterer(map);
	geocoder = new google.maps.Geocoder();

} // close initMap function


function myAddMarkers(bandName, city, state, started) {

	var bandInfo = "<div><p><strong>"+bandName+"</strong></p><p>"+city+", "+state+"</p><p>Started in: "+started+"</p></div>"

	geocoder.geocode({address: city}, function (results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			var infowindow = new google.maps.InfoWindow({
				content: bandInfo
			});
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				animation: google.maps.Animation.DROP,
				title: bandName
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
			markers.push(marker);
		} // end of if
	});

} // end addMarker function

// remove map markers and clear decades labels
function clearOverlays() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
	$('.decades').remove();
}

// ECHO NEST API CALL
var getArtists = function(year) {
	var startYear = year;
	var endYear = (parseInt(year)+11);
	endYear = endYear.toString();

	// the parameters we need to pass in our request to echonest's API
	var request = { 
		artist_start_year_after: startYear,
		artist_start_year_before: endYear,
	}; // end request
	
	var baseURL = "http://developer.echonest.com/api/v4/artist/search?api_key=DIVEWNESX3GN4Q7NV&";
	var searchURL = "&artist_start_year_after=1969&artist_start_year_before=1980&";
	var restofURL ="artist_location=us&bucket=artist_location&bucket=years_active&format=json&callback=?&results=30";
	$.ajax({
		url: baseURL+restofURL,
		data: request,
	}) // end ajax method
	.done(function(response){ //this waits for the ajax to return with a succesful promise object
		var artistResp = response.response.artists;
		for (var i = 0; i < artistResp.length; i++) {
			myFunction = function() {

				var artist = {
					bandName: artistResp[i].name, 
					city: artistResp[i].artist_location.city, 
					state: artistResp[i].artist_location.region, 
					started: artistResp[i].years_active[0].start
				};

				myAddMarkers(artist.bandName, artist.city, artist.state, artist.started);
				artistSet.push(artist);
			};
			myFunction();
		} // end for loop

		$('#year').val('default');

	}) // end done method
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	}); // end fail method
}; // end getArtists


// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};
