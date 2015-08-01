'use strict';
var googlejs = angular.module('google', []);

googlejs.factory('googleService', [
	'$document', '$q', '$rootScope', '$window',
	function($document, $q, $rootScope, $window) {
		var d = $q.defer();

		var scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		scriptTag.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=googleMapsCallback';

		$window.googleMapsCallback = function() {
			$rootScope.$apply(function() { d.resolve($window.google); });
		};

		var s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

		return {
			google: function() { return d.promise; }
		};
	}]);
