var googlePlacesLoader=function(){function e(e,r,n){var c=["geometry","name","place_id","price_level","rating","vicinity"];if(r==google.maps.places.PlacesServiceStatus.OK)for(var i=0;i<e.length;i++){var t=e[i];o.push(a(t,c))}n.hasNextPage?(console.log("There is more!"),setTimeout(function(){n.nextPage()},2e3)):console.log(JSON.stringify(o))}function a(e,a){var r={};return a.forEach(function(a){r[a]=e[a]}),r}function r(a){var r={location:a,radius:"300",types:["restaurant","cafe","bar"]};service=new google.maps.places.PlacesService(map),service.nearbySearch(r,e)}var o=[];return{fetchDinersFromGooglePlaces:r}}();