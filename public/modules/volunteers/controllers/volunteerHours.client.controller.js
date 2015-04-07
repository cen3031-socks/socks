
'use strict';
// Volunteers controller
angular.module('volunteers').controller('VolunteerHours', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers' ,
    function($scope, $stateParams, $location, Authentication, Volunteers) {
        $scope.authentication = Authentication;
        /*
        *code below gives errors when uncommented
        *
        *
        
        $scope.getMinutesWorked(firstDate, lastDate){
            return volunteer.minutesWorked(firstDate, lastDate);
        }
        */

    }
]);

