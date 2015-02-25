describe('contacts listing', function() {
	it('should have a title', function() {
		browser.get('/');
		expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
	});

	it('should be able to create new contact', function() {
		browser.get('/#!/contacts');
		element(by.partialButtonText('New')).click();
		var contact = {
			firstName: "John",
			surname: "Appleseed",
			address: "1 Infinite Loop",
			city: "Cupertino",
			state: "California",
			zipCode: "12345",
			phone: "(850) 555 - 1234",
			email: "john.appleseed@example.com"
		};

        for (var i in contact) {
            element(by.model(i)).sendKeys(contact[i]);
        }
        element(by.buttonText('Save')).click();

		/* Make sure we went to a view contact page */
		expect(browser.getCurrentUrl()).toMatch(/contacts\/[a-z\d]{24}$/);

		/* check that all the fields have the right values. */
		for (var i in contact) {
			if (i === 'firstName' || i === 'surname') {
				expect(element(by.binding(i)).getText()).toBe(
						contact['firstName'] + ' ' + contact['surname']
					);
			}
			else {
				expect(element(by.binding(i)).getText()).toBe(contact[i]);
			}
		}
	});
});

