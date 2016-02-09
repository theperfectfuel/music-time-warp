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
    //myAddMarker(city);
    getArtists(year);
    console.log(artists);
  });

}); // end ready function

// Global variables for map functionality
var artistSet = [];
var map;
var mc;
var geocoder;
var coords_obj;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: {lat: 37.397, lng: -100.644},
    zoom: 4,
    scrollwheel: false,
    draggable: true,
    disableDefaultUI: true,
  });

  mc = new MarkerClusterer(map);
  geocoder = new google.maps.Geocoder();

} // close initMap function

function myAddMarker(name, city) {
  var markerInfo = name + ": " + city;

    geocoder.geocode({address: city}, function (results, status) {


      if(status == google.maps.GeocoderStatus.OK) {
        var infowindow = new google.maps.InfoWindow({
          content: markerInfo
        });
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            title: name
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        markers.push(marker);
    } // end of if
  });

} // end addMarker function

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
  var restofURL ="artist_location=us&bucket=artist_location&bucket=years_active&format=json&callback=?&results=50";
  $.ajax({
    url: baseURL+restofURL,
    data: request,
  }) // end ajax method
  .done(function(response){ //this waits for the ajax to return with a succesful promise object
    artistSet = response.response.artists;
    for (i in artistSet) {
      var artistName = artistSet[i].name;
      var artistCity = artistSet[i].artist_location.city;
      myAddMarker(artistName, artistCity);
    } // end for loop
  }) // end done method
  .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
    var errorElem = showError(error);
    $('.search-results').append(errorElem);
  }); // end fail method
}; // end getArtists

/*var showInspiration = function(artists) {
  
  // clone our result template code
  var response = $('.templates .artist').clone();
  
  // Set the artist name properties in result
  var artistElem = response.find('.artist-name');
  artistElem.text(artists.name);

  // set the reputation property in result
  var city = response.find('.city');
  city.text(artists.artist_location.city);

  return response;
};*/

// takes error string and turns it into displayable DOM element
var showError = function(error){
  var errorElem = $('.templates .error').clone();
  var errorText = '<p>' + error + '</p>';
  errorElem.append(errorText);
};
