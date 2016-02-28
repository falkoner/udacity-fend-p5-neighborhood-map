function showErrorNotification(e){var i='<div class="alert alert-danger" role="alert">MESSAGE</div>';$("div#map-canvas").remove(),$("div.info-zone").remove();var n=$("#notifications-zone-template").html();$("div#main").append(n),$("div.notifications-zone div").append(i.replace("MESSAGE",e))}function noMapError(){var e="Can't load the map and app";showErrorNotification(e)}function noSeedDataError(){var e="Can't load seed data";showErrorNotification(e)}function initMap(){var e=new google.maps.LatLng(37.376773,-122.030157),i={center:e,scrollWheel:!1,disableDefaultUI:!0,mapTypeId:google.maps.MapTypeId.ROADMAP,zoom:18,styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]};map=new google.maps.Map(document.getElementById("map-canvas"),i),infoWindow=new google.maps.InfoWindow({content:'<div id="infowindow-container" data-bind="template: { name: \'diner-infowindow-template\', data: selectedDiner }"></div>',maxWidth:360});var n=!1;google.maps.event.addListener(infoWindow,"domready",function(){n||(ko.applyBindings(viewModel,$("#infowindow-container")[0]),n=!0)}),viewModel.isMapLoaded(!0),viewModel.loadStoredData(viewModel.renderMarkers),ko.applyBindings(viewModel)}var map,infoWindow,Diner=function(e){var i=this,n="img/icon_24.png";i.name=e.name,i.coordinates=e.geometry.location,i.id=e.place_id,i.price_level=parseInt(e.price_level)||"n/a",i.rating=parseFloat(e.rating)||"n/a",i.vicinity=e.vicinity,i.visitCounter=ko.observable(""),i.visible=ko.observable(!0);var o;i.setMarker=function(){o=new google.maps.Marker({position:i.coordinates,title:i.name,url:"#",icon:n,animation:google.maps.Animation.DROP}),o.setMap(map),o.addListener("click",function(){viewModel.selectDiner(i)})},i.select=function(){map.panTo(i.coordinates),infoWindow.open(map,o),o.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){o.setAnimation(null)},3e3)},i.deselect=function(){infoWindow.close(),o.setAnimation(null)},i.show=function(){i.visible(!0),o.setMap(map)},i.hide=function(){i.visible(!1),o.setMap(null)}},DinersViewModel=function(){var e=this;e.selectedDiner=ko.observable(),e.isMapLoaded=ko.observable(!1),e.listOfDiners=ko.observableArray([]),e.listOfVisibleDiners=ko.computed(function(){return e.listOfDiners().filter(function(e){return e.visible()})}),e.selectDiner=function(i){e.selectNoDiner(),i.select(),e.selectedDiner(i)},e.selectNoDiner=function(){e.selectedDiner()&&e.selectedDiner().deselect()},e.visitDiner=function(e){var i=e.visitCounter();""===i&&(i=0),e.visitCounter(i+1)},e.searchTerm=ko.observable(""),e.searchDiner=function(){""!==e.searchTerm()&&(e.hideFilteredDiners(),$(".navbar-collapse").collapse("hide"))},e.sortDiners=function(i){return e.sorters.current===i?void e.listOfDiners.reverse():(e.sorters.current=i,e.listOfDiners.sort(e.sorters.getSorter("id")),void e.listOfDiners.sort(e.sorters.getSorter(i)))},e.sorters={current:"",getSorter:function(e){return function(i,n){var o="string"==typeof i[e]?i[e].toLowerCase():i[e],t="string"==typeof n[e]?n[e].toLowerCase():n[e];return"n/a"===o&&(o=0),o==t?0:t>o?-1:1}}},e.showAllDiners=function(){e.listOfDiners().forEach(function(e){e.show()}),e.searchTerm("")},e.hideFilteredDiners=function(){var i=new RegExp(e.searchTerm(),"gi");e.listOfDiners().forEach(function(e){e.name.match(i)?e.show():e.hide()})},e.hideVisitedDiners=function(){e.listOfDiners().forEach(function(e){""!==e.visitCounter()&&e.hide()})},e.visitProgress=ko.computed(function(){var i=0,n=0;return e.listOfDiners().forEach(function(e){e.visitCounter()>0&&i++}),n=e.listOfDiners().length,i+" out of "+n},this),e.renderMarkers=function(){e.listOfDiners().forEach(function(e){e.setMarker()})},e.loadStoredData=function(i){$.getJSON("js/seeddata.json").done(function(n){e.listOfDiners([]),n.forEach(function(i){e.listOfDiners.push(new Diner(i))}),"function"==typeof i&&i()}).fail(function(){noSeedDataError()})}};ko.components.register("yelp-data",{viewModel:function(e){var i=this;i.name=ko.observable(),i.is_closed=ko.observable(),i.image_url=ko.observable(),i.url=ko.observable(),i.display_phone=ko.observable(),i.review_count=ko.observable(),i.categories=ko.observable(),i.rating=ko.observable(),i.snippet_text=ko.observable(),i.error=ko.observable(!1);var n=function(e){var n;e.length<1?i.error(!0):(n=e[0],ko.mapping.fromJS(n,{},i))};yelpConnector.fetchDinerDetailsFromYelp(e.name,e.address,n)},template:{element:"yelp-data-template"}});var viewModel=new DinersViewModel;