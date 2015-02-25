var request = require('request'),
	MongoClient = require('mongodb').MongoClient;

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

	describe('with contacts in database', function() {
		beforeEach(function() {
			/* create a bunch of contacts */
			var jar = request.jar();
			var req = request.defaults({jar:jar});

			function post(url, params) {
				var defer = protractor.promise.defer();
				req.post({ url: browser.baseUrl + url, form: params},
					function(error, message) {
						if (error || message.statusCode >= 400) {
							defer.reject({ error: error, message: message });
						} else {
							defer.fulfill(message);
						}
					});
				return defer.promise;
			}

			function dropDb() {
				var defer = protractor.promise.defer();
				MongoClient.connect('mongodb://localhost:27017/mean-dev', function(err, db) {
					if (!!err)  {
						console.log('connection to db failed', err);
						defer.reject({error: err});
					} else {
						db.dropDatabase();
						defer.fulfill();
					}
				});
				return defer.promise;
			}

			function postContact(contact) {
				return function() {
					return post('/contacts', contact) 
				}
			}

			var flow = protractor.promise.controlFlow();
			flow.execute(dropDb);
			this.contacts = [];
			for (var i = 0; i < 10; ++i) {
				var name = 'TestName'+String.fromCharCode('A'.charCodeAt(0) + i);
				var contact = {
					firstName: name,
					surname: name
				};
				this.contacts.push(contact);
				flow.execute(postContact(contact));
			}

			browser.get('/#!/contacts');
			this.searchBar = element(by.model('searchText'));
			this.rows = element.all(by.css('tr[data-ng-repeat*=contact]'));
		});

		it('should have no results when searching for a name not in the list', function() {
			this.searchBar.sendKeys('ZZZZZZZ');
			expect(this.rows.count()).toBe(0);
		});

		it('should have exactly one result when searching for a unique name in the list', function() {
			this.searchBar.sendKeys('TestNameF');
			expect(this.rows.count()).toBe(1);
		});

		it('should show all contacts when the entry is cleared', function() {
			this.searchBar.sendKeys('ZZZZZZ');
			this.searchBar.clear();
			expect(this.rows.count()).toBe(this.contacts.length);
		});
	});
});

