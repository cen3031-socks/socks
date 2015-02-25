
describe('volunteer page', function() {
    it('should be able to sign in', function() {
        browser.get('/#!/volunteers/create');

		/* Sign a volunteer in */
		element(by.model('name')).sendKeys('Alexander Russ');
		element(by.css('[type=submit]:first-child')).click();

		/*expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#!/volunteers');*/

		browser.get('/#!/volunteers');

		element.all(by.repeater('volunteer in volunteers')).then(function(data) {
            console.log(data);
			expect(protractor.promise.all(data).then(function(elements) {
                for (var i in elements) {
                    elements[i].evaluate('volunteer.name').then(function(name) {
                        console.log(name);
                        if (name === 'Alexander Russ') {
                            self.isFound = true;
                        }
                    });
                }
			}));
			/*.toContain(*/
			/*jasmine.objectContaining({name: 'Alexander Russ'})*/
			/*);*/
		});
    });
});
