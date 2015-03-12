'use strict';

angular.module('core').controller('CatViewController', ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope',
		function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope) {
			// This provides Authentication context.
			$scope.authentication = Authentication;

			$scope.eventLimit = 3;
			$scope.showMore = function() {
				$scope.eventLimit += 5;
			};
			$scope.isFound = false;

			$scope.getCat = function() {
				$scope.cat = Cats.get({catId: $stateParams.catId}, 
					function() {
						$scope.isFound = true;
				});
			};

			$scope.getCat();


			$scope.addEvent = function() { 
				$modal.open({
					templateUrl: '/modules/cats/views/add-event.client.modal.html',
					controller: function(cat, Cats, $scope, $modalInstance) {
						$scope.getIcon = function() {
							return 'glyphicon-pushpin';
						};
						$scope.createEvent = function() {
							Cats.addEvent({catId: cat._id}, {
								eventType: $scope.eventType,
								detail: $scope.detail,
								label: $scope.label,
								date: $scope.date,
								icon: $scope.getIcon()
							}, function() {
								$modalInstance.close(true);
							});
						};
						console.log(cat);
						console.log($scope);
					}, 
					resolve: {
						cat: function() {
							return $scope.cat;
						}
					}
				}).result.then(function() {
					$scope.getCat();
				});
			};

			$scope.onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
				console.log($scope.newNote);
				if (($scope.newNote || '') != '') {
					var modalScope = $rootScope.$new();
					modalScope.message = 'You have unsaved data entered on this page. Do you want to leave without saving?';
					$modal.open({
						templateUrl: '/modules/core/views/confirm-dialog.client.modal.html',
						scope: modalScope
					}).result.then(function(result) {
						if (result) {
							$scope.onRouteChangeOff();
							$location.path(newState);
						}
					});
					event.preventDefault();
				}
			});

			$scope.deleteEvent = function(event) {
				var modalScope = $rootScope.$new();
				modalScope.message = 'Are you sure you want to delete this event?';
				$modal.open({
					templateUrl: '/modules/core/views/confirm-dialog.client.modal.html',
					scope: modalScope
				}).result.then(function(result) {
					if (result) {
						Cats.deleteEvent({catId: $scope.cat._id, eventId: event._id},
							function() {
								$scope.getCat();
							});
					}
				});
			};

			$scope.convertSex = function(sexNumber) {
				if (sexNumber === 0) {
					return 'Unknown';
				}
				else if (sexNumber === 1) {
					return 'Male';
				}
				else if (sexNumber === 2) {
					return 'Female';
				}
				else if (sexNumber === 9) {
					return 'N/A';
				}
			};
		}]
);
