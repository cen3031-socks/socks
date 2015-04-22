var images = angular.module('images');

images.controller('ImageGalleryController', [
    '$scope', 'Images', '$location',
    function($scope, Images, $location) {
        $scope.selectedImages = $scope.selectedImages || [];
        $scope.selectedImage = $scope.selectedImage || undefined;
        $scope.pageSize = 20;
        $scope.hasMore = true;

        $scope.$watch('imageId', function() {
            if ($scope.imageId) {
                Images.find($scope.imageId).then(function (response) {
                    // if given a single image id then just show that id
                    $scope.images = [response.data];
                    $scope.addSources();
                });
                $scope.hasMore = false;
            }
        });

        $scope.$watch('catId', function() {
            if ($scope.catId) {
                Images.forCat($scope.catId).then(function (response) {
                    // if given a cat ID only show images for that cat
                    $scope.images = response.data;
                    $scope.addSources();
                });
                $scope.hasMore = false;
            }
        });

        $scope.$watch('showAll', function(newValue, oldValue) {
            if (oldValue) {
                $scope.images = [];
            }
            if (newValue) {
                Images.list($scope.pageSize, 0).then(function (response) {
                    $scope.images = response.data;
                    $scope.addSources();
                });
            }
        });

        $scope.loadMore = function() {
            Images.list($scope.pageSize, $scope.images.length).
                then(function(response) {
                    if (response.data.length < $scope.pageSize) {
                        $scope.hasMore = false;
                    }
                    $scope.images = $scope.images.concat(response.data);
                    $scope.addSources();
                });
        };

        $scope.imageClicked = function(image) {
            if ($scope.selectMode === 'single') {
                if ($scope.selectedImage || image.selected) {
                    $scope.selectedImage.selected = false;
                }
                $scope.selectedImage = image;
                image.selected = true;
            } else if ($scope.selectMode) {
                var index = $scope.selectedImages.indexOf(image);
                if (index === -1) {
                    $scope.selectedImages.push(image);
                    image.selected = true;
                } else {
                    $scope.selectedImages.splice(index, 1);
                    image.selected = false;
                }
            } else {
                $location.path('/images/' + image._id);
            }
        };

        $scope.$watch('selectMode', function() {
            if (!$scope.selectMode) {
                for (var i = 0; i < $scope.selectedImages.length; ++i) {
                    $scope.selectedImages[i].selected = false;
                }
                $scope.selectedImages = [];
                if ($scope.selectedImage) {
                    $scope.selectedImage.selected = false;
                    $scope.selectedImage = undefined;
                }
            }
        })

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
            scope: {
                imageId: '=?id',
                catId: '=?forCat',
                max: '=?max',
                selectMode: '=?selectMode',
                selectedImages: '=?selectedImages',
                selectedImage: '=?selectedImage',
                showAll: '=?showAll'
            },
            templateUrl: '/modules/images/views/image-gallery.client.directive.html',
            link: function(scope, element, attrs, ctrl) { }
        };
    }]);
