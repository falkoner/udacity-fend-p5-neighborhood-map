var googlePlacesLoader = (function() {
  var resultsString = [];

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
    keys.forEach(function(key) {
      newObject[key] = sourceObject[key];
    });
    return newObject;
  }


  function fetchDinersFromGooglePlaces(latlng) {
    var request = {
      location: latlng,
      radius: '300',
      types: ['restaurant', 'cafe', 'bar']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, processSearchResults);
  }

  return {
    fetchDinersFromGooglePlaces: fetchDinersFromGooglePlaces
  }


})();
