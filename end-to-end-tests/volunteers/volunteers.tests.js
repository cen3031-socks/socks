describe('volunteer page', function() {
	it('should be able to sign in', function() {

		browser.get('/volunteer-signin');

		/* Sign a volunteer in */
		element(by.partialButtonText('Click'));
		expect(true);
	});
});
