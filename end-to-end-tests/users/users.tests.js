var request = require('request'),
	MongoClient = require('mongodb').MongoClient;

describe('employees listing', function() {
	it('should have a title', function() {
		browser.get('/#!/signin');
		browser.get('/');
		expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
	});

	it('should be able to create new employee', function() {
		browser.get('/#!/employees');
		element(by.css('.myButton')).click();
		var user = {
			firstName: "TestUnique",
			surname:"Test",
			email: "email@email.com",
			permissionLevel: "0"
		};

        for (var i in user) {
            element(by.model(i)).sendKeys(user[i]);
        }
        element(by.buttonText('Create')).click();

		/* Home page */
		expect(browser.getCurrentUrl()).toMatch();
		browser.get('/#!/contacts');
		this.searchBar = element(by.model('searchText'));
		this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
		this.searchBar.sendKeys('TestUnique');
		expect(this.rows.count()).toBe(1);
		var rowElems = this.rows.$$('td');
		for (var i in user) {
            expect(rowElems.get(i).getText()).toMatch(user[i]);
        }
	});
});