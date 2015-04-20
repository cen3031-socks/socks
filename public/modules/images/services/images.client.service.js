'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('images')
    .factory('Images', ['$http', function($http) {
        return {
            list: function() {
                return $http.get('/images');
            },
            create: function(image) {
                return $http.post('/images', image);
            },
            find: function(imageId) {
                return $http.get('/images/' + imageId);
            },
            update: function(image) {
                return $http.put('/images/' + image._id, image);
            },
            forCat: function(catId) {
                return $http.get('/cats/' + catId + '/images');
            }
        };
    }
    ]);

