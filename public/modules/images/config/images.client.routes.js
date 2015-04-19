'use strict';

//Setting up route
angular.module('images', ['ui.router']).config(['$stateProvider',
	function($stateProvider) {
        // Contacts state routing
        $stateProvider.
            state('imageGallery', {
                url: '/images',
                templateUrl: 'modules/images/views/image-gallery.client.view.html'
            }).
            state('uploadImage', {
                url: '/images/upload',
                templateUrl: 'modules/images/views/upload-image.client.view.html'
            });
	}
]);
