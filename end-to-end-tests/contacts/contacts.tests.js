var request = require('request'),
	MongoClient = require('mongodb').MongoClient,
    utils = require('../test-utils');

describe('contacts listing', function() {
    beforeEach(function() {
        utils.createUserAndSignIn(browser, element);
    });

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
			phone: "(850) 555-3234",
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
				if(i === 'state') {
					expect(element(by.binding(i)).getText()).toBe('CA');
				} else {
					expect(element(by.binding(i)).getText()).toBe(contact[i]);
				}
			}
		}
	});

	describe('with contacts in database', function() {
		beforeEach(function() {
			/* create a bunch of contacts */
			var flow = protractor.promise.controlFlow();
            var self = this;
            flow.execute(function() {
                self.contacts = [];
                for (var i = 0; i < 10; ++i) {
                    var name = 'TestName'+String.fromCharCode('A'.charCodeAt(0) + i);
                    var contact = {
                        firstName: name,
                        surname: name
                    };
                    self.contacts.push(contact);
                }
                return utils.db(function(db) {
                    db.collection('contacts').insert(self.contacts, utils.throwIfPresent);
                });
            });

		});

		it('should have no results when searching for a name not in the list', function() {
            browser.get('/#!/contacts');
            this.searchBar = element(by.model('searchText'));
            this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
			this.searchBar.sendKeys('ZZZZZZZ');
			expect(this.rows.count()).toBe(0);
		});

		it('should have exactly one result when searching for a unique name in the list', function() {
            browser.get('/#!/contacts');
            this.searchBar = element(by.model('searchText'));
            this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
			this.searchBar.sendKeys('TestNameF');
			expect(this.rows.count()).toBe(1);
		});

		it('should show all contacts when the entry is cleared', function() {
            browser.get('/#!/contacts');
            this.searchBar = element(by.model('searchText'));
            this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
			this.searchBar.sendKeys('ZZZZZZ');
			this.searchBar.clear();
			expect(this.rows.count()).toBe(this.contacts.length + 1);
		});
	});
});

