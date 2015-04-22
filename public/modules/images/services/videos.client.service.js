'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('images')
    .factory('Videos', ['$http', function($http) {
        return {
            list: function() {
                return $http.get('/videos');
            },
            create: function(image) {
                return $http.post('/videos', image);
            },
            find: function(imageId) {
                return $http.get('/videos/' + imageId);
            },
            update: function(image) {
                return $http.put('/videos/' + image._id, image);
            },
            forCat: function(catId) {
                return $http.get('/cats/' + catId + '/videos');
            },
            deleteAll: function(videos) {
                console.log(videos);
                return $http.post('/delete-videos', { images: videos });
            }
        };
    }
    ]);

