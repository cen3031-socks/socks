describe('volunteer page', function() {
	it('should be able to sign in', function() {

		browser.get('/#!/volunteers/create');

		/* Sign a volunteer in */
		element(by.model('name')).sendKeys('Alexander Russ');
		element(by.css('[type=submit]:first-child')).click();

		/*expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#!/volunteers');*/
		browser.get('/#!/volunteers');

		expect(element
					.all(
						by.repeater('volunteer in volunteers')
						  .column('volunteer.name'))
					.map(function(e) { return e.getText(); }))
			.toContain('Alexander Russ');
	});
});
