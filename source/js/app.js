/* top level variables */
var map;
var infoWindow;

/* error handling functions */

/**
 * Error of Google Maps load failure
 */
function noMapError() {
  var errorMessage = "Can't load the map and app";
  viewModel.globalError(errorMessage);
}

/**
 * Error on failure to load seed data
 */
function noSeedDataError() {
  var errorMessage = "Can't load seed data";
  viewModel.globalError(errorMessage);
}

/* class to represent a diner */
var Diner = function(rawData) {
  var self = this;

  self.icon = "img/icon_24.png";
  self.name = rawData.name;
  self.coordinates = rawData.geometry.location;
  self.id = rawData.place_id;
  self.price_level = parseInt(rawData.price_level) || "n/a";
  self.rating = parseFloat(rawData.rating) || "n/a";
  self.vicinity = rawData.vicinity;

  self.visitCounter = ko.observable('');
  self.visible = ko.observable(true);

  // these function need to stay here to get reference to proper objects
  // upon creation
  self.clickListener = function() {
    viewModel.selectDiner(self);
  };

  self.cancelAnimation = function() {
    self.marker.setAnimation(null);
  };
};

Diner.prototype.setMarker = function() {
  this.marker = new google.maps.Marker({
    position: this.coordinates,
    title: this.name,
    url: '#',
    icon: this.icon,
    animation: google.maps.Animation.DROP
  });
  this.marker.setMap(map);
  this.marker.addListener('click', this.clickListener);
};

Diner.prototype.select = function() {
  map.panTo(this.coordinates);
  infoWindow.open(map, this.marker);
  this.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(this.cancelAnimation, 3000);
};

Diner.prototype.show = function() {
  this.visible(true);
  this.marker.setMap(map);
};

Diner.prototype.deselect = function() {
  infoWindow.close();
  this.marker.setAnimation(null);
};

Diner.prototype.hide = function() {
  this.visible(false);
  this.marker.setMap(null);
};

/* main view model */
var DinersViewModel = function() {
  var self = this;

  self.selectedDiner = ko.observable();
  self.isMapLoaded = ko.observable(false);
  self.listOfDiners = ko.observableArray([]);
  self.listOfVisibleDiners = ko.computed(function() {
    return self.listOfDiners().filter(function(diner) {
      return diner.visible();
    });
  });

  self.selectDiner = function(diner) {
    self.selectNoDiner();
    diner.select();
    self.selectedDiner(diner);
  };

  self.selectNoDiner = function() {
    if (self.selectedDiner()) {
      self.selectedDiner().deselect();
    }

    // can't do that - will break binding to info window
    // self.selectedDiner(null);
  };

  self.visitDiner = function(diner) {
    var counter = diner.visitCounter();
    if (counter === '') {
      counter = 0;
    }
    diner.visitCounter(counter + 1);
  };

  // sorting and filtering functionality
  self.searchTerm = ko.observable("");

  self.searchDiner = function() {
    if (self.searchTerm() !== "") {
      self.hideFilteredDiners();
      $('.navbar-collapse').collapse('hide');
    }
  };
  self.sortDiners = function(sorter) {
    if (self.sorters.current === sorter) {
      self.listOfDiners.reverse();
      return;
    }
    self.sorters.current = sorter;
    self.listOfDiners.sort(self.sorters.getSorter("id"));
    self.listOfDiners.sort(self.sorters.getSorter(sorter));
  };

  self.sorters = {
    current: "",
    getSorter: function(sorter) {
      return function(left, right) {
        var l = typeof left[sorter] === 'string' ?
          left[sorter].toLowerCase() : left[sorter];
        var r = typeof right[sorter] === 'string' ?
          right[sorter].toLowerCase() : right[sorter];
        // typeof l === 'string' && (l = l.toLowerCase());
        if (l === 'n/a') {
          l = 0;
        }
        return l == r ? 0 : (l < r ? -1 : 1);
      };
    }
  };

  self.showAllDiners = function() {
    self.listOfDiners().forEach(function(diner) {
      diner.show();
    });
    self.searchTerm("");
  };

  self.hideFilteredDiners = function() {
    var st = new RegExp(self.searchTerm(), 'gi');
    self.listOfDiners().forEach(function(diner) {
      if (diner.name.match(st)) {
        diner.show();
      } else {
        diner.hide();
      }
    });
  };

  self.hideVisitedDiners = function() {
    self.listOfDiners().forEach(function(diner) {
      if (diner.visitCounter() !== '') {
        diner.hide();
      }
    });
  };

  self.visitProgress = ko.computed(function() {
    var visited = 0;
    var total = 0;

    self.listOfDiners().forEach(function(diner) {
      if (diner.visitCounter() > 0) {
        visited++;
      }
    });

    total = self.listOfDiners().length;
    return visited + " out of " + total;
  }, this);

  self.renderMarkers = function() {
    self.listOfDiners().forEach(function(diner) {
      diner.setMarker();
    });
  };

  self.loadStoredData = function(callback) {
    $.getJSON("js/seeddata.json")
      .done(function(data) {
        self.listOfDiners([]);
        data.forEach(function(diner) {
          self.listOfDiners.push(new Diner(diner));
        });
        typeof callback === 'function' && callback();
      })
      .fail(function() {
        noSeedDataError();
      });
  };

  // error handling
  self.globalError = ko.observable("");

  // self.loadStoredData();
};

/* special component for Yelp data */
ko.components.register('yelp-data', {
  viewModel: function(params) {
    var self = this;
    self.name = ko.observable();
    self.is_closed = ko.observable();
    self.image_url = ko.observable();
    self.url = ko.observable();
    self.display_phone = ko.observable();
    self.review_count = ko.observable();
    self.categories = ko.observable();
    self.rating = ko.observable();
    self.snippet_text = ko.observable();

    self.error = ko.observable(false);

    var processYelpDetails = function(results) {
      var diner;
      if (results.length < 1) { // was not able to get data from Yelp
        self.error(true);
      } else {
        diner = results[0];
        ko.mapping.fromJS(diner, {}, self);
      }
    };

    yelpConnector.fetchDinerDetailsFromYelp(params.name, params.address,
      processYelpDetails);
  },
  template: {
    element: 'yelp-data-template'
  }
});

var viewModel = new DinersViewModel();
ko.applyBindings(viewModel);
/**
 * Main map initialization function
 */
function initMap() {

  /* position Sunnyvale downtown */
  var latlng = new google.maps.LatLng(37.376773, -122.030157);

  var mapOptions = {
    center: latlng,
    scrollWheel: false,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 18,
    styles: [{
      featureType: "poi",
      elementType: "labels",
      stylers: [{
        visibility: "off"
      }]
    }]
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  // info window initialization with template
  infoWindow = new google.maps.InfoWindow({
    content: '<div id="infowindow-container" data-bind="' +
      "template: { name: 'diner-infowindow-template', data: selectedDiner }" +
      '"></div>',
    maxWidth: 360

  });
  var isInfoWindowLoaded = false;

  google.maps.event.addListener(infoWindow, 'domready', function() {
    if (!isInfoWindowLoaded) {
      ko.applyBindings(viewModel, $('#infowindow-container')[0]);
      isInfoWindowLoaded = true;
    }
  });

  // remove map-loader placeholder
  viewModel.isMapLoaded(true);
  viewModel.loadStoredData(viewModel.renderMarkers);
  // render seed markers only when map available
  // viewModel.renderMarkers();

  // use in debug mode only to get data from google
  // googlePlacesLoader.fetchDinersFromGooglePlaces(latlng);

  // use in debug mode to get initial ids for places in Yelp
  // yelpConnector.fetchDinersFromYelp(latlng);
}
