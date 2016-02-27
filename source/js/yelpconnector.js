var yelpConnector = (function() {
  var oauth = OAuth({
    consumer: {
      public: 'C-4GDCnkh-Dxhk6pWNoscw',
      secret: '65MBaRTfFXAejPbc_dUhv1q8cTQ'
    },
    signature_method: 'HMAC-SHA1'
  });

  var token = {
    public: 'wDH7ic6093-SbTXCOpwe7gPh7AS6J993',
    secret: 'tmQwFSFiYwRu8Ta4a4NYFtNUUQ8'
  };

  var results = [];
  var offset = 0;
  var setStep = 20;

  var sendSearchRequest = function(requestPayload, callback) {
    $.ajax({
      url: requestPayload.url,
      type: requestPayload.method,
      dataType: "jsonp",
      cache: true,
      data: oauth.authorize(requestPayload, token)
    }).done(function(data) {
      results = results.concat(data.businesses);
      if (data.total > (offset + setStep)) {
        offset += setStep;
        requestPayload.data.offset = offset;
        sendSearchRequest(requestPayload, callback);
        return;
      }
      // console.log(JSON.stringify(results));
    }).fail(function(jqxhr, textStatus, error) {
      // Let empty results set indicate problem with load.
      // If there is no callback - there are no UI dependencies
      console.log("Failed to load: " + textStatus + ", " + error);
    }).always(function() {
      typeof callback === 'function' && callback(results);
    });
  };

  /**
   * Function to get list of diners around specified point from Yelp
   * @param  {Object} latlng LatLng object to center the search
   */
  function fetchDinersFromYelp(latlng) {
    results = [];
    offset = 0;

    var requestData = {
      url: 'https://api.yelp.com/v2/search',
      method: 'GET',
      data: {
        callback: "cb",
        category_filter: "restaurants,cafes,bars,diners",
        radius_filter: 300,
        ll: latlng.lat() + ',' + latlng.lng()
      }
    };

    sendSearchRequest(requestData);
  }

  /**
   * Function to get details of specified diner
   * @param  {String}   name     Name of a diner
   * @param  {String}   address  Address of the diner
   * @param  {Function} callback callback to process details
   */
  function fetchDinerDetailsFromYelp(name, address, callback) {
    console.log("using yelp");
    results = [];
    offset = 0;

    var requestData = {
      url: 'https://api.yelp.com/v2/search',
      method: 'GET',
      data: {
        callback: "cb",
        category_filter: "restaurants,cafes,bars,diners",
        term: name,
        location: address,
        radius_filter: 300,
        limit: 1
      }
    };

    sendSearchRequest(requestData, callback);
  }

  return {
    fetchDinersFromYelp: fetchDinersFromYelp,
    fetchDinerDetailsFromYelp: fetchDinerDetailsFromYelp
  };
})();
