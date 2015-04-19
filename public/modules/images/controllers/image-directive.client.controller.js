var images = angular.module('images');

images.controller('ImageGalleryController', [
    '$scope', 'Images',
    function($scope, Images) {
        console.log('initializd controller');

        if ($scope.imageId) {
            console.log('loading images by id');
            Images.find($scope.imageId).then(function(response) {
                // if given a single image id then just show that id
                $scope.images = [response.data];
                $scope.addSources();
            });
        } else if ($scope.catId) {
            console.log('loading images for cat');
            Images.forCat($scope.catId).then(function(response) {
                // if given a cat ID only show images for that cat
                $scope.images = response.data;
                $scope.addSources();
            });
        } else {
            console.log('loading all images');
            // if no parameters, show all images
            Images.list().then(function(response) {
                $scope.images = response.data;
                $scope.addSources();
            });
        }

        $scope.addSources = function() {
            var images = $scope.images;
            for (var i = 0; i < images.length; ++i) {
                var image = images[i];
                image.thumbnailSrc = '/images/' + image._id + '/thumbnail';
                image.originalSrc = '/images/' + image._id + '/original';
                image.largeSrc = '/images/' + image._id + '/large';
            }
        };
    }
]);

images.directive('imageGallery', [
    function() {
        return {
            restrict: 'E',
            controller: 'ImageGalleryController',
            scope: { imageId: '=?id', catId: '=?forCat', max: '=?max' },
            templateUrl: '/modules/images/views/image-gallery.client.directive.html',
            link: function(scope, element, attrs, ctrl) { }
        };
    }]);

