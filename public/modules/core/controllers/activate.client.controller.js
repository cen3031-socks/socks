'use strict';
angular.module('core').controller('ActivationController', ['$scope', '$http', 'Dialogs',
		function($scope, $http, Dialogs) {
			$scope.create = function() {
                var admin = {
                    firstName: this.firstName,
                    surname: this.lastName,
                    password: this.password,
                    username: this.username
                };
                $http.post('/create-admin', admin).success(function() {
                    Dialogs.notify('Admin account successfully created')
                        .then(function() {
                            window.location.href = '/';
                        });
                });
			};
		}
]);
