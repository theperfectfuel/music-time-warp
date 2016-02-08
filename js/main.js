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
    getInspiration(year);
  });


});

var artistSet = [];
var map;
var mc;
var markers = [];
function initMap() {
  //var myLatLng = new google.maps.LatLng(37.397, -100.644);
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: {lat: 37.397, lng: -100.644},
    zoom: 4,
    scrollwheel: false,
    draggable: true,
    disableDefaultUI: true,
  });

/*  var marker = new google.maps.Marker({
  position: myLatLng,
  map: map,
  title: 'Hello World!'
  });*/

  mc = new MarkerClusterer(map);

}

function myAddMarker(name, city) {
  //Geocode function
  var geocoder = new google.maps.Geocoder();

   function getCoordinates(city, callback) {
    var coordinates;
    geocoder.geocode({address: city}, function (results, status) {
      coords_obj = results.geometry.location;
      coordinates = [coords_obj.nb,coords_obj.ob];
      console.log(coordinates);
      callback(coordinates);
    })
  }

  var cityCoords = getCoordinates(city);


  //var newlat = coords_obj.nb;
  //var newlng = coords_obj.ob;
  var newMarker = new google.maps.Marker({
    position: cityCoords,
    title: name
  });
  markers.push(newMarker);
  mc.addMarker(markers[markers.length - 1], true);
  $('#year').val('default');

} // end addMarker function


// ECHO NEST API CALL
var getInspiration = function(year) {
  var startYear = year;
  var endYear = (parseInt(year)+11);
  endYear = endYear.toString();
  // the parameters we need to pass in our request to echonest's API
  var request = { 
    artist_start_year_after: startYear,
    artist_start_year_before: endYear,
  };
  
  var baseURL = "http://developer.echonest.com/api/v4/artist/search?api_key=DIVEWNESX3GN4Q7NV&";
  var searchURL = "&artist_start_year_after=1969&artist_start_year_before=1980&";
  var restofURL ="artist_location=us&bucket=artist_location&bucket=years_active&format=json&callback=?";
  $.ajax({
    url: baseURL+restofURL,
    //jsonpCallback: 'myJSFunc',
    //contentType: "application/json",
    data: request,
    //dataType: "JSONP",//use jsonp to avoid cross origin issues
    //type: "GET",
  })
  .done(function(response){ //this waits for the ajax to return with a succesful promise object
    artistSet = response.response.artists;

    for (i in artistSet) {
      var artistName = artistSet[i].name;
      var artistCity = artistSet[i].artist_location.city;
      myAddMarker(artistName, artistCity);


      console.log(artistSet[i].name, artistSet[i].artist_location.city);
    }

/*    var searchResults = showSearchResults(response.artists);
    $('.search-results').html(searchResults);
    //$.each is a higher order function. It takes an array and a function as an argument.
    //The function is executed once for each item in the array.
    $.each(response.items, function(i, item) {
      var artists = showInspiration(item);
      $('.results').append(artists);
    });*/
  })
  .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
    var errorElem = showError(error);
    $('.search-results').append(errorElem);
  });
};

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
