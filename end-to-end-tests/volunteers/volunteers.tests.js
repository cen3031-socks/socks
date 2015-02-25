describe('volunteer page', function() {
    it('should be able to sign in', function() {
        browser.get('/#!/volunteers/create');

		/* Sign a volunteer in */
		element(by.model('name')).sendKeys('Alexander Russ');
		element(by.css('[type=submit]')).click();

		/*expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#!/volunteers');*/

		browser.get('/#!/volunteers');

		element.all(by.repeater('volunteer in volunteers')).then(function(data) {

			protractor.promise.all(data)
			expect(protractor.promise.all(data).map(function(elements) {
				console.log(elements);
			}));
			/*.toContain(*/
			/*jasmine.objectContaining({name: 'Alexander Russ'})*/
			/*);*/
		});
    });
});
