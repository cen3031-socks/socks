var page = require('webpage').create();

page.viewportSize = {
	width: 800,
	height: 1280
};
page.onResourceRequested = function(request) {
	console.log('Request ' + request.url); 
};
console.log('opening page.');
page.open('http://localhost:1234/', function() {
		console.log('rendering page.');
		page.render('../screenshot.png');
		phantom.exit();
});
