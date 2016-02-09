/* google maps */
var map, infoWindow;

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
      '"></div>'
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
  // viewModel.loadStoredData();
  // render seed markers only when map available
  viewModel.renderMarkers();

  // use in debug mode only to get data from google
  // googlePlacesLoader.fetchDinersFromGooglePlaces(latlng);
}

/* class to represent a diner */
var Diner = function(rawData) {
  var self = this;
  var icon = "img/icon_24.png";

  self.name = rawData.name;
  self.coordinates = rawData.geometry.location;
  self.id = rawData.place_id;
  self.price_level = parseInt(rawData.price_level) || "n/a";
  self.rating = parseFloat(rawData.rating) || "n/a";
  self.vicinity = rawData.vicinity;

  self.visitCounter = ko.observable('');
  self.visible = ko.observable(true);

  var marker;

  self.setMarker = function() {
    marker = new google.maps.Marker({
      position: self.coordinates,
      title: self.name,
      url: '#',
      icon: icon,
      animation: google.maps.Animation.DROP
    });
    marker.setMap(map);
    marker.addListener('click', function() {
      viewModel.selectDiner(self);
    });
  };

  self.select = function() {
    infoWindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 5000);
  }

  self.deselect = function() {
    infoWindow.close();
    marker.setAnimation(null);
  }

  self.show = function() {
    self.visible(true);
    marker.setMap(map);
  }

  self.hide = function() {
    self.visible(false);
    marker.setMap(null);
  }

};

var DinersViewModel = function() {
  var self = this;

  self.selectedDiner = ko.observable();
  self.isMapLoaded = ko.observable(false);
  self.listOfDiners = ko.observableArray([]);
  self.listOfVisibleDiners = ko.computed(function() {
    return self.listOfDiners().filter(function(diner) {
      return diner.visible();
    })
  })

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

  self.searchDiner = function () {
    if(self.searchTerm() != "") {
      self.hideFilteredDiners();
      self.searchTerm("");
    }
  }
  self.sortDiners = function(sorter) {
    if (self.sorters.current === sorter) {
      self.listOfDiners.reverse();
      return;
    }
    self.sorters.current = sorter;
    self.listOfDiners.sort(self.sorters.getSorter("id"));
    self.listOfDiners.sort(self.sorters.getSorter(sorter));
  }

  self.sorters = {
    current: "",
    getSorter: function functionName(sorter) {
      return function(left, right) {
        l = left[sorter];
        r = right[sorter];
        if (l === 'n/a') {
          l = 0;
        }
        return l == r ? 0 : (l < r ? -1 : 1)
      }
    }
  }

  self.showAllDiners = function() {
    self.listOfDiners().forEach(function(diner) {
      diner.show();
    })
  }

  self.hideFilteredDiners = function () {
    if (self.searchTerm() != "") {
      console.log("cheking search term");
      self.listOfDiners().map(function(diner) {
        st = new RegExp(self.searchTerm(), 'gi');
        if(!diner.name.match(st)) {
          console.log("hiding");
          diner.hide();
        }
      })
    }
  }

  self.hideVisitedDiners = function() {
    self.listOfDiners().forEach(function(diner) {
      if (diner.visitCounter() !== '') {
        diner.hide();
      }
    })
  }

  self.visitProgress = ko.computed(function() {
    var visited = 0,
      total = 0;

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
  }

  self.loadStoredData = function() {
    $.getJSON("/js/seeddata.json")
      .done(function(data) {
        self.listOfDiners([]);
        data.forEach(function(diner) {
          self.listOfDiners.push(new Diner(diner));
        });
      });
  };

  self.loadStoredData();
};

var viewModel = new DinersViewModel();
ko.applyBindings(viewModel);
