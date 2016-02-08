var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: {lat: 37.397, lng: -100.644},
    zoom: 4,
    scrollwheel: false,
    draggable: true,
    disableDefaultUI: true,
  });
}