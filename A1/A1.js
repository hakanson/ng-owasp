// app.js
(function() {
	'use strict';

	angular
		.module('app', [
			'ngSanitize'
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
			i = $interpolate(vm.template);

			var context = { twitter : vm.twitter};
			vm.rendered = i(context);
			if (vm.trusted == true) {
				vm.rendered = $sce.trustAsHtml(vm.rendered);
			}
		};

		vm.update();
	}
})();