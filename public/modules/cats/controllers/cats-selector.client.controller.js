'use strict';

var cats = angular.module('core');
cats.controller('CatsSelectorController', [
	'$stateParams', 'Cats', '$modal', '$scope', '$rootScope',
	function($stateParams, Cats, $modal, $scope, $rootScope) {
		console.log('cat selector');
		$scope.selectedCats = $scope.selectedCats || [];

		if ($scope.max === undefined) {
			$scope.max = Infinity;
		}

		$scope.showModal = function() {
			if ($scope.max === undefined) {
				$scope.max = Infinity;
			}

			// if we've already got enough cats selected, don't show the modal.
			if ($scope.selectedCats.length >= $scope.max) {
				return;
			}

			// set the parameters used inside the modal
			var modalScope = $rootScope.$new();
			modalScope.title = $scope.title || 'Find a Cat';
			modalScope.hideUntil = $scope.hideUntil || 3;
			modalScope.selectText = $scope.selectText || 'Select a cat';

			var modalInstance = $modal.open({
				scope: modalScope,
				templateUrl: '/modules/cats/views/select-cat-list.client.template.html',
				controller: function($scope, $modalInstance, Cats, $modal) {
					$scope.cats = Cats.query();
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
					$scope.select = function(cat) {
						$modalInstance.close(cat);
					};
					$scope.createCat = function() {
						var createModal = $modal.open({
							templateUrl: '/modules/cats/views/create-cats.client.view.html',
							size: 'lg',
							controller: ''
						});
						// stop route changes to /cats/:catId so the create-cat view doesn't take you
						// off the page.
						var onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
							if (newState.match(/\/cats\/[\w\d]{24}$/)) {
								onRouteChangeOff();
								createModal.dismiss();
								$modalInstance.close(Cats.get({catId: newState.match(/[\w\d]{24}$/)}));
								event.preventDefault();
							}
						});
					};
				},
				size: 'md'
			});
			modalInstance.result.then($scope.select);
		};

		$scope.select = function(cat) {
			if ($scope.selectedCats.indexOf(cat) !== -1) {
				$scope.selectedCats.splice($scope.selectedCats.indexOf(cat), 1);
			}
			$scope.selectedCats.push(cat);
		};

		$scope.unselect = function(cat, index) {
			$scope.selectedCats.splice(index, 1);
		};
	}]);
/**
 * Creates a directive cats-selector, which acts like a form input.
 * It allows the user to select a number of cats. Sets its ng-model
 * to be an array of the selected cats
 *
 * Attributes:
 *      max         the maximum allowable number of cats
 *      title       the text to show at the top of the selector
 *      hide-until  the number of characters to require to be typed before showing any cats in the list
 */
	cats.directive('catsSelector', function() {
		return {
			restrict: 'E',
			controller: 'CatsSelectorController',
			scope: { maxCats: '=max', selectedCats: '=?ngModel', title: '=?title', hideUntil: '=?hideUntil', selectText: '=?selectText' },
			templateUrl: '/modules/cats/views/cat-selector.client.template.html',
			link: function(scope, element, attrs, ctrl) { }
		};
	});

/**
 * Creates a directive cat-link that makes it easy to make a link to a cat from a
 * cat id.
 */
	cats.directive('catLink', ['Cats', function(Cats) {
		return {
			restrict: 'E',
			controller: 'CatLinkController',

			template: '<a href="#!/cats/{{cat._id}}">{{cat.name}}</a>',
			scope: { catId: '=catId' },
			link: function(scope, element, attrs, ctrl) { }
		};
	}]);

	cats.controller('CatLinkController', [ '$scope', 'Cats', function($scope, Cats) {
		$scope.$watch('catId', function() {
			if ($scope.catId !== undefined) {
				$scope.cat = Cats.get({catId: $scope.catId});
			} else {
				$scope.cat = undefined;
			}
		});
	}]);
