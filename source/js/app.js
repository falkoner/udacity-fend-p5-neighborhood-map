/* google maps */
var map;

function initMap() {

  /* position Sunnyvale downtown */
  var latlng = new google.maps.LatLng(37.376773, -122.030157);

  var mapOptions = {
    center: latlng,
    scrollWheel: false,
    zoom: 18
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  // render seed markers only when map available
  viewModel.renderMarkers();
};

/* seed data array */
var seedDiners = [
  {
      name: "Fast Lane Coffee",
      lat: 37.376773,
      lng: -122.030157,
      id: "4d9a662a674ca14376eaba43"
  },
  {
      name: "Second Lane Coffee",
      lat: 37.38,
      lng: -122.04,
      id: "4d9a662a674ca14376eaba43"
  },
  {
      name: "Third Lane Coffee",
      lat: 37.3699,
      lng: -122.0299,
      id: "4d9a662a674ca14376eaba43"
  }
];

/* class to represent a diner */
var Diner = function (rawData) {
  var self = this;
  self.name = ko.observable(rawData.name);
  self.coordinates = {lat: rawData.lat, lng: rawData.lng};
  self.id = ko.observable(rawData.id);

  self.setMarker = function () {
    var marker = new google.maps.Marker({
      position: self.coordinates,
      url: '#',
      animation: google.maps.Animation.DROP
    });

    marker.setMap(map);
  }

}

var DinersViewModel = function (rawDinersData) {
  var self = this;

  self.selectedDiner = ko.observable();

  self.listOfDiners = ko.observableArray([]);
  rawDinersData.forEach(function (diner) {
      self.listOfDiners.push(new Diner(diner));
  });

  self.selectDiner = function(diner) {
    self.selectedDiner(diner);
  };

  self.renderMarkers = function() {
    self.listOfDiners().forEach(function (diner) {
      diner.setMarker();
    });
  }
}

var viewModel = new DinersViewModel(seedDiners);
ko.applyBindings(viewModel);

