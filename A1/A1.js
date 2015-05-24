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

	function InterpolateController($interpolate, $sanitize, $sce) {
		var vm = this, i;

		vm.twitter = "hakanson";
		vm.template = 'Twitter: <a href="https://twitter.com/{{twitter}}">@{{twitter}}</a>';

		vm.save = function () {
			i = $interpolate(vm.template);
		};

		vm.renderTempate = function() {
			var context = { twitter : vm.twitter};
			//return i(context);
			return $sce.trustAsHtml(i(context));
		};

		vm.save();
	}
})();