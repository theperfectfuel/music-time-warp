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
    var city = $('#year').val();
    myAddMarker(city);
  });

});

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

function myAddMarker(city) {

  switch (city) {
    case 'seattle':
      var newLatLng = new google.maps.LatLng(47.6097, -122.3331);
      break;
    case 'los-angeles':
      var newLatLng = new google.maps.LatLng(34, -118);
      break;
    case 'san-francisco':
      var newLatLng = new google.maps.LatLng(37, -122);
      break;
    case 'memphis':
      var newLatLng = new google.maps.LatLng(35, -90);
      break;
    default:
      alert('Sorry, we do not have that city');
      break;
    }

  var newlat = newLatLng.lat();
  var newlng = newLatLng.lng();
  var newMarker = new google.maps.Marker({
    position: newLatLng,
    title: 'Another one!'
  });
  markers.push(newMarker);
  mc.addMarker(markers[markers.length - 1], true);
  $('#year').val('default');

} // end addMarker function


