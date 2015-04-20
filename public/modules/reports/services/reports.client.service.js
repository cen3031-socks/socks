'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('reports')
    .factory('Reports', ['$http', function($http) {
		return {
            list: function() {
                return $http.get('/reports');
            },
            create: function(report) {
                return $http.post('/reports', report);
            },
            resultOfImmediate: function(report) {
                return $http.post('/reports/result-of', report);
            },
            resultOf: function(reportId) {
                return $http.get('/reports/' + reportId + '/result');
            },
            find: function(reportId) {
                return $http.get('/reports/' + reportId);
            },
            update: function(report) {
                return $http.put('/reports/' + report._id, report);
            }
        };
	}
]);
