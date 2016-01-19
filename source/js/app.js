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

  // remove map-loader placeholder
  viewModel.isMapLoaded(true);
  // viewModel.loadStoredData();
  // render seed markers only when map available
  viewModel.renderMarkers();

  // fetchDinersFromGooglePlaces(latlng);
}

/* search for diners */
function fetchDinersFromGooglePlaces(latlng) {
  var resultsString = [];

  var request = {
    location: latlng,
    radius: '300',
    types: ['restaurant', 'cafe', 'bar']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, processSearchResults);

  function processSearchResults(results, status, pagination) {
    var usefulProperties = ['geometry', 'name', 'place_id', 'price_level', 'rating', 'vicinity'];

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        resultsString.push(cloneAndPluck(place, usefulProperties));
      }
    }
    if (pagination.hasNextPage) {
      console.log("There is more!");
      setTimeout(function() {
        pagination.nextPage();
      }, 2000);
    } else {
      console.log(JSON.stringify(resultsString));
    }
  }


  function cloneAndPluck(sourceObject, keys) {
    var newObject = {};
    keys.forEach(function(key) { newObject[key] = sourceObject[key]; });
    return newObject;
  }
}

/* class to represent a diner */
var Diner = function (rawData) {
  var self = this;
  self.name = ko.observable(rawData.name);
  self.coordinates = rawData.geometry.location;
  self.id = ko.observable(rawData.place_id);
  self.price_level = rawData.price_level;
  self.rating = rawData.rating;
  self.vicinity = rawData.vicinity;

  self.visitCounter = ko.observable('');

  self.setMarker = function () {
    var marker = new google.maps.Marker({
      position: self.coordinates,
      url: '#',
      animation: google.maps.Animation.DROP
    });

    marker.setMap(map);
  };

};

var DinersViewModel = function () {
  var self = this;

  self.selectedDiner = ko.observable();
  self.isMapLoaded = ko.observable(false);
  self.listOfDiners = ko.observableArray([]);

  self.selectDiner = function(diner) {
    self.selectNoDiner();
    self.selectedDiner(diner);
    // TODO show info box on map
  };

  self.selectNoDiner = function() {
    self.selectedDiner(null);
    // TODO remove info box from map
  };

  self.visitDiner = function(diner) {
    var counter = diner.visitCounter();
    if (counter === '') {
      counter = 0;
    }
    diner.visitCounter(counter + 1);
  };

  self.visitProgress = ko.computed(function() {
    var visited = 0, total = 0;

    self.listOfDiners().forEach(function (diner) {
      if (diner.visitCounter() > 0) {
        visited++;
      }
    });

    total = self.listOfDiners().length;
    return visited + " out of " + total;
  }, this);

  self.renderMarkers = function() {
    self.listOfDiners().forEach(function (diner) {
      diner.setMarker();
    });
  };

  self.loadStoredData = function() {
    $.getJSON("/js/seeddata.json")
      .done(function(data) {
        self.listOfDiners([]);
        data.forEach(function (diner) {
            self.listOfDiners.push(new Diner(diner));
        });
      });
  };

  self.loadStoredData();
};

var viewModel = new DinersViewModel();
ko.applyBindings(viewModel);

