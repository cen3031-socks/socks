var request = require('request'),
	MongoClient = require('mongodb').MongoClient;

describe('employees listing', function() {
	it('should have a title', function() {
		browser.get('/activate');
		element(by.model('username')).sendKeys('email@email.com');
		element(by.model('password')).sendKeys('password');
		element(by.model('firstName')).sendKeys('John');
		element(by.model('lastName')).sendKeys('Smith');
		element(by.buttonText('Submit')).click();
		browser.get('/#!/signin');
		element(by.model('credentials.username')).sendKeys('email@email.com');
		element(by.model('credentials.password')).sendKeys('password');
		element(by.buttonText('Sign in')).click();
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