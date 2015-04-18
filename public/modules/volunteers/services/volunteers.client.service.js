'use strict';

//Volunteers service used to communicate Volunteers REST endpoints
angular.module('volunteers').factory('Volunteers', ['$resource',
	function($resource) {
		return $resource('volunteers/:volunteerId', { volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            getByName: {
                method: 'GET',
                url: '/volunteers/by-name/:contactId',
                isArray: true
            },
            minutesWorked: {
                method: 'GET',
                url: '/volunteers/get-minutes/:contactId/:startDate_:endDate',
                isArray: false
            }
		});
	}
]);
