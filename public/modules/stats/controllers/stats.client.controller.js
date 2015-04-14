'use strict';
(function(google) {
    angular.module('stats').directive('adopterMap', function(Contacts) {
        var addresses = [];
        var latlong = [];
        var adopterWithAddress = [];
        var geocoder= new google.maps.Geocoder();
        var streets = [];
        var citiesStatesZipCodes = [];
        // directive link function
        var link = function(scope, element, attrs) {
            var map, infoWindow;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(30, -78),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            // init the map
            function initMap() {
                var adopters = Contacts.getAllAdopters(function() {
                    var i;
                    for(i = 0; i < adopters.length; i++) {
                        adopterWithAddress.push(adopters[i].firstName + ' ' + adopters[i].surname);
                        streets.push(adopters[i].address);
                        citiesStatesZipCodes.push(adopters[i].city + ', ' + adopters[i].state + ' ' + adopters[i].zipCode);
                        addresses.push(adopters[i]. address + ', ' + adopters[i].city + ', ' + adopters[i].state + ' ' + adopters[i].zipCode);
                    }
                    i = 0;
                    for(var j = 0; j < addresses.length; j++) {
                        console.log('5');
                        codeAddress(addresses[j], i);
                        i = i + 1;
                    }

                });

                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(map, position, title, content) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }
            function codeAddress(address, i) {

                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var p = results[0].geometry.location;
                        setMarker(map, p, '', adopterWithAddress[i] + '<br/>' + streets[i] + '<br/>' + citiesStatesZipCodes[i]);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

            // show the map and place some markers
            initMap();
        };

        return {
            restrict: 'A',
            template: '<div id="gmaps"></div>',
            replace: true,
            link: link
        };
    });

    angular.module('stats').directive('originsMap', function(Cats) {
        var addresses = [];
        var latlong = [];
        var catWithAddress = [];
        var geocoder= new google.maps.Geocoder();
        // directive link function
        var link = function(scope, element, attrs) {
            var map, infoWindow;
            var markers = [];

            // map config
            var mapOptions = {
                center: new google.maps.LatLng(30, -78),
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            // init the map
            function initMap() {
                var cats = Cats.query(function() {
                    var i = 0;
                    for (i = 0; i < cats.length; i++) {
                        catWithAddress.push(cats[i].name);
                        addresses.push(cats[i].origin.address);
                    }
                    i = 0;
                    for (var j = 0; j < addresses.length; j++) {
                        console.log('5');
                        codeAddress(addresses[j], i);
                        i = i + 1;
                    }

                });
                console.log('ADDRESSES: ' + addresses.length + addresses[0]);
                if (map === void 0) {
                    map = new google.maps.Map(element[0], mapOptions);
                }
            }

            // place a marker
            function setMarker(map, position, title, content) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }
            function codeAddress(address, i) {

                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var p = results[0].geometry.location;
                        setMarker(map, p, '', catWithAddress[i] + '<br/>' + addresses[i]);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

            // show the map and place some markers
            initMap();
        };

        return {
            restrict: 'A',
            template: '<div id="gmaps"></div>',
            replace: true,
            link: link
        };
    });
}(google));
