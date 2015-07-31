'use strict';
angular.module('core').directive('customDatepicker', function() {
    return {
        restrict: 'E',
        controller: function ($scope) {
            $scope.isOpen = false;
            $scope.toggle = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.isOpen = !$scope.isOpen;
            };
        },
        templateUrl: '/modules/core/views/datepicker-popup-easy.html',
        scope: {
            selectedDate: '=?ngModel',
            unselectedText:'=?unselectedText',
            inline: '=?inline'
        }
    };
});
