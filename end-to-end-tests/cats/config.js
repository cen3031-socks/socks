exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*.tests.js'],
	baseUrl: 'http://localhost:3000',
	onPrepare: function() {
		var SpecReporter = require('jasmine-spec-reporter');
		// add jasmine spec reporter
		jasmine.getEnv().addReporter(new
		SpecReporter({displayFailuresSummary: false}));
	},
	jasmineNodeOpts: {
		print: function() {}
	}
}
