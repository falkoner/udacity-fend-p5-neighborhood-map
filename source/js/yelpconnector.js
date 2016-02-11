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

  function fetchDinersFromYelp(latlng) {
    console.log("using yelp");

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

    $.ajax({
      url: request_data.url,
      type: request_data.method,
      dataType: "jsonp",
      cache: true,
      data: oauth.authorize(request_data, token)
    }).done(function(data) {
      console.log(data);
    }).fail(function (jqxhr, textStatus, error) {
      console.log("Failed to load: " + textStatus + ", " + error);
    });
  }

  return {
    fetchDinersFromYelp: fetchDinersFromYelp
  }
})();
