var googlePlacesLoader = (function() {
  var resultsString = [];

  /**
 * Callback function to process results of the request of
 * Google Places API 'nearbySearch'
 * @param  {Object} results    Set of search results
 * @param  {Object} status     Search status
 * @param  {Object} pagination Indicator of multipage response
 */
  function processSearchResults(results, status, pagination) {
    var usefulProperties = ['geometry', 'name', 'place_id', 'price_level',
     'rating', 'vicinity'];

    if (status === google.maps.places.PlacesServiceStatus.OK) {
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
/**
 * Utility method to trim object from redundant keys
 * @param  {object} sourceObject initial object
 * @param  {array} keys         array of keys to preserve
 * @return {object}              new object with requested keys
 */
  function cloneAndPluck(sourceObject, keys) {
    var newObject = {};
    keys.forEach(function(key) {
      newObject[key] = sourceObject[key];
    });
    return newObject;
  }
/**
 * Debug function to get list of diners around location
 * @param  {Object} latlng LatLng object to center the search
 */
  function fetchDinersFromGooglePlaces(latlng) {
    var request = {
      location: latlng,
      radius: '300',
      types: ['restaurant', 'cafe', 'bar']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, processSearchResults);
  }

  return {
    fetchDinersFromGooglePlaces: fetchDinersFromGooglePlaces
  };
})();
