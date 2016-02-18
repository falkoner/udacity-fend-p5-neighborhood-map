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
  var set_step = 20;

  var sendSearchRequest = function (request_payload, callback) {
    $.ajax({
      url: request_payload.url,
      type: request_payload.method,
      dataType: "jsonp",
      cache: true,
      data: oauth.authorize(request_payload, token)
    }).done(function(data) {
      results = results.concat(data.businesses);
      if (data.total > (offset + set_step)) {
        offset = offset + set_step;
        request_payload.data.offset = offset;
        sendSearchRequest(request_payload);
        return;
      }
      // console.log(JSON.stringify(results));
      typeof callback === 'function' && callback(results);

    }).fail(function (jqxhr, textStatus, error) {
      console.log("Failed to load: " + textStatus + ", " + error);
    });
  }

  function fetchDinersFromYelp(latlng) {
    results = [];
    offset = 0;

    var request_data = {
      url: 'https://api.yelp.com/v2/search',
      method: 'GET',
      data: {
        "callback": "cb",
        "category_filter": "restaurants,cafes,bars,diners",
        "radius_filter": 300,
        "ll": latlng.lat() + ',' + latlng.lng()
      }
    };

    return sendSearchRequest(request_data);

  }

  function fetchDinerDetailsFromYelp(name, address, callback) {
    console.log("using yelp");
    results = [];
    offset = 0;

    var request_data = {
      url: 'https://api.yelp.com/v2/search',
      method: 'GET',
      data: {
        "callback": "cb",
        "category_filter": "restaurants,cafes,bars,diners",
        "term": name,
        "location": address,
        "radius_filter": 300,
        "limit": 1
      }
    };

    sendSearchRequest(request_data, callback);
  }

  return {
    fetchDinersFromYelp: fetchDinersFromYelp,
    fetchDinerDetailsFromYelp: fetchDinerDetailsFromYelp
  }
})();
