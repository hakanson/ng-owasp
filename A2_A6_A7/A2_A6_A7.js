// app.js
(function() {
	'use strict';

	angular
		.module('app', [
			'ngRoute'
		]);
})();

// app.config.js
(function() {
	'use strict';

	angular
		.module('app')
		.config(function ($routeProvider) {
			$routeProvider
				.when('/',
				{
					templateUrl: 'home.html'
				})
				.when('/login',
				{
					templateUrl: 'login.html',
					controller: 'AuthController as vm',
					data : {
						myAnonymousAttr: true
					}
				})
				.when('/logout',
				{
					templateUrl: 'logout.html',
					controller: 'AuthController as vm'
				})
				.when('/contactus',
				{
					templateUrl: 'contactus.html',
					data : {
						myAnonymousAttr: true
					}
				})
				.when('/feature',
				{
					templateUrl: 'feature.html',
					controller: 'FeatureController as vm'
				});
		})
		.config(function ($httpProvider) {
			$httpProvider.interceptors.push(function($q, $rootScope) {
				return {
					'responseError': function(rejection) {
						if (rejection.status === 401) {
							$rootScope.$broadcast('Auth:Required');
						}
						return $q.reject(rejection);
					}
				};
			});
		})
		.run(function($rootScope, $location, $route, AuthService, StorageService) {
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
				var currentRoute = $route.routes[$location.path()];

				if (!AuthService.isAuthenticated()) {
					if (!(currentRoute && currentRoute.data && currentRoute.data.myAnonymousAttr)) {
						$rootScope.$broadcast('Auth:Required');
						event.preventDefault();
					}
				}
			});

			$rootScope.$on('Auth:Required', function() {
				$location.path('/login');
			});

			$rootScope.$on('Auth:Login', function() {
				$location.path('/');
			});

			$rootScope.$on('Auth:Logout', function() {
				// clear user info
				StorageService.clear();

				$rootScope.$broadcast('Auth:Required');
			});
		})
		.run(function($window, StorageService) {
			$window.addEventListener('beforeunload', function(event) {
				// clear user info
				StorageService.clear();
			});
		});
})();

// auth.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('AuthController', AuthController);

	function AuthController(AuthService) {
		var vm = this;

		vm.login = function() {
			AuthService.login();
		};

		vm.logout = function() {
			AuthService.logout();
		};
	}
})();

// feature.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('FeatureController', FeatureController);

	function FeatureController(StorageService) {
		var vm = this;

		vm.data = StorageService.get();

		vm.save = function () {
			StorageService.set(vm.data);
		};
	}
})();

// auth.service.js
(function() {
	'use strict';

	angular
		.module('app')
		.factory('AuthService', AuthService);

	function AuthService($rootScope) {
		var authenticated = false;
		return {
			login: function() {
				authenticated = true;
				$rootScope.$broadcast('Auth:Login');
			},
			logout: function() {
				authenticated = false;
				$rootScope.$broadcast('Auth:Logout');
			},
			isAuthenticated : function() {
				return authenticated;
			}
		};
	}
})();

// storage.service.js
(function() {
	'use strict';

	angular
		.module('app')
		.factory('StorageService', StorageService);

	function StorageService() {
		var ITEM_KEY = "OWASP";
		return {
			set: function(value) {
				localStorage.setItem(ITEM_KEY, value);
			},
			get: function() {
				return localStorage.getItem(ITEM_KEY) || "";
			},
			clear : function() {
				localStorage.removeItem(ITEM_KEY);
			}
		};
	}
})();