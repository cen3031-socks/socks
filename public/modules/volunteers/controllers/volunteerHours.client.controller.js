
'use strict';
// Volunteers controller
angular.module('volunteers').controller('VolunteerHours', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers' ,
    function($scope, $stateParams, $location, Authentication, Volunteers) {
        $scope.authentication = Authentication;
    }]);

