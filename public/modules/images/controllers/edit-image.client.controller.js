var images = angular.module('images');

images.controller('EditImageController', [
    '$scope', 'Images', '$stateParams',
    function($scope, Images, $stateParams) {
        $scope.$watch(
            function() { return $stateParams.imageId; },
            function() {
                if ($stateParams.imageId) {
                    console.log($stateParams.imageId);
                    Images.find($stateParams.imageId)
                        .then(function (response) {
                            $scope.image = response.data;
                            $scope.addSource();
                        });
                }
            });

        $scope.addSource = function() {
            var image = $scope.image;
            image.thumbnailSrc = '/images/' + image._id + '/thumbnail';
            image.originalSrc = '/images/' + image._id + '/original';
            image.largeSrc = '/images/' + image._id + '/large';
        };

        $scope.save = function() {
            Images.
                update($scope.image).
                then(function(response) {
                    $scope.image = response.data;
                },
                function(response) {
                    Dialogs.notify('Something went wrong: ' + response.data.message);
                });

        };
    }
]);

