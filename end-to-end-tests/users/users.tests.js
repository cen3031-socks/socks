var request = require('request'),
	MongoClient = require('mongodb').MongoClient;

describe('employees listing', function() {
	it('should have a title', function() {
		browser.get('/');
		expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
	});

	it('should be able to create new employee', function() {
		browser.get('/#!/employees');
		element(by.css('.myButton')).click();
		var user = {
			firstName: "Test",
			lastName:"Test",
			email: "email@email.com",
			permissionLevel: "0"
		};

        for (var i in user) {
            element(by.model(i)).sendKeys(user[i]);
        }
        element(by.buttonText('Create')).click();

		/* Home page */
		expect(browser.getCurrentUrl()).toMatch();

		/* check that all the fields have the right values. (need edit profile to work) */
		// for (var i in user) {
		// 	if (i === 'firstName' || i === 'surname') {
		// 		expect(element(by.binding(i)).getText()).toBe(
		// 				contact['firstName'] + ' ' + contact['surname']
		// 			);
		// 	}
		// 	else {
		// 		expect(element(by.binding(i)).getText()).toBe(contact[i]);
		// 	}
		// }
	});
});