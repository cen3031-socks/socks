var request = require('request'),
	MongoClient = require('mongodb').MongoClient;
var utils = require('../test-utils.js');

describe('employees listing', function() {
	beforeEach(function() {
        utils.createUserAndSignIn(browser, element);
    });

	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
	});

	it('should be able to create new employee and contact with it', function() {
		browser.get('/#!/employees/create');
		var user = {
			firstName: "TestUnique",
			surname:"Test",
			email: "email2@email.com",
		};

        for (var i in user) {
            element(by.model(i)).sendKeys(user[i]);
        }

        var select = element(by.model('permissionLevel'));
        select.$('[value="1"]').click();

        element(by.buttonText('Create')).click();

		/* Home page */
		expect(browser.getCurrentUrl()).toMatch();

		
		browser.get('/#!/contacts');
		this.searchBar = element(by.model('searchText'));
		this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
		this.searchBar.sendKeys('TestUnique');
		expect(this.rows.count()).toBe(1);
		var rowElems = this.rows.$$('td');
		expect(rowElems.get(0).getText()).toMatch('TestUnique');
		expect(rowElems.get(1).getText()).toMatch('Test');
	});	
});