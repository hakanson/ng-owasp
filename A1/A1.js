// app.js
(function() {
	'use strict';

	angular
		.module('app', [
			'ngSanitize',
			'pascalprecht.translate'
		]);
})();

// binding.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('BindingController', BindingController);

	function BindingController($sanitize, $sce) {
		var vm = this;

		var data = '<b onmouseover="alert(\'over\')">trust me</b>: <script>alert("XSS");</script> <xss>XSS</xss>';

		vm.untrusted = data;
		vm.sanitized = $sanitize(data);
		vm.trusted = $sce.trustAsHtml(data);
	}
})();

// interpolate.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('InterpolateController', InterpolateController);

	function InterpolateController($interpolate, $sce) {
		var vm = this, i;

		vm.twitter = "hakanson";
		vm.template = 'Twitter: <a href="https://twitter.com/{{twitter}}">@{{twitter}}</a>';
		vm.trusted = false;
		vm.rendered = "";

		vm.update = function () {
			var context = { twitter : vm.twitter};
			i = $interpolate(vm.template);
			vm.rendered = i(context);
			if (vm.trusted == true) {
				vm.rendered = $sce.trustAsHtml(vm.rendered);
			}
		};

		vm.update();
	}
})();

// trust.filter.js
(function() {
	'use strict';

	angular
		.module('app')
		.filter('trust', function($sce) {
			return function(input) {
				return $sce.trustAsHtml(input);
			};
		});
})();

// app.config.js
(function() {
	'use strict';

	angular
		.module('app')
		.config(function ($translateProvider) {
			$translateProvider.translations('en', {
				GREETING: '<b onmouseover="alert(\'over\')">Hello</b> {{name}}',
				GREETINGX: '<b>Hello</b> {{name | uppercase}}'
			});

			$translateProvider.preferredLanguage('en');

			//$translateProvider.useSanitizeValueStrategy('sanitize');
		});
})();

// translate.controller.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('TranslateController', TranslateController);

	function TranslateController() {
		var vm = this;

		//vm.parameters = {name:'<i>Kevin</i>'};
		vm.parameters = {name:'<i onmouseover="alert(\'Kevin\')">Kevin</i>'};
	}
})();