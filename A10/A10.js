// app.js
(function() {
	'use strict';

	angular
		.module('app', [
			'ngSanitize',
			'ngRoute'
		]);
})();

// app.config.js
(function() {
	'use strict';

	var whiteList = /(https\:\/\/[a-z\.]+\.(com|net|org))/;

	angular
		.module('app')
		.config(function ( $compileProvider, $routeProvider ) {
			$compileProvider.aHrefSanitizationWhitelist(whiteList);

			$routeProvider
				.when('/redirect', {
					template: '<em>redirecting in 3 seconds...</em>',
					controller: function ($scope, $location, $timeout, $window) {
						$scope.url = $location.$$search['url'] || '';

						if ($scope.url.match(whiteList)) {
							$timeout(function () {
								$window.location.href = $scope.url;
							}, 3000)
						} else {
							$location.path('/redirectDenied');
						}
					}
				})
				.when('/redirectDenied', {
					template: '<em>redirect URL not in whiteList</em>'
				})
			}
		);
})();

// links.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('LinksController', LinksController);

	function LinksController() {
		var vm = this;

		vm.links = [
			'http://angularjs.org/',
			'https://angularjs.org/',
			'https://t.co/rLBxlqZZ0c',
			'https://goo.gl/ZF7ddU',
			'https://www.google.com/#q=angular',
			'https://www.owasp.org/'
		];
	}
})();