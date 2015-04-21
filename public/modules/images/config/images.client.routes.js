'use strict';

//Setting up route
angular.module('images', ['ui.router', 'angularFileUpload']).config(['$stateProvider',
	function($stateProvider) {
        // Contacts state routing
        $stateProvider.
            state('imageGallery', {
                url: '/images',
                templateUrl: 'modules/images/views/image-gallery.client.view.html'
            }).
            state('uploadImage', {
                url: '/image-upload',
                templateUrl: 'modules/images/views/upload-image.client.view.html'
            }).
            state('editImage', {
                url: '/images/:imageId',
                templateUrl: 'modules/images/views/edit-image.client.view.html'
            });
	}
]);
