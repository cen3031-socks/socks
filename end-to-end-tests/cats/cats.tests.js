var MongoClient = require('mongodb').MongoClient;
var utils = require('../test-utils.js');

describe('cats homepage', function() {
    it('should have a title', function() {
        browser.get('/');

        expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
    });

    it('should be able to add a cat to database', function() {
        browser.get('/');

        element(by.id('new-cat')).click();

        var cat = {
            name: 'Test Cat',
            color: 'Green',
            breed: 'Test Breed', 
			location: 'Test Location',
			dateOfBirth: '02/15/2014',
			dateOfArrival: '02/15/2015',
			vet: 'Dr. Smith',
            temperament: 'Test Temperament',
            owner: 'Test Owner',
            description: 'Test Description',
			originAddress: '1 Somewhere Street',
			originPerson: 'Mr. Nobody',
            notes: ['Test Note']
        };

        for (var i in cat) {
            element(by.model(i)).sendKeys(cat[i]);
        }

        element(by.id('submit')).click();

		for (var i in cat) {
			if (i === 'dateOfBirth' || i === 'dateOfArrival') {
				(function(theI) {
					element(by.id(theI)).getText().then(function(text) {
						expect(Date.parse(text)).toBe(Date.parse(cat[theI]));
					}); 
				}(i));
			}
			else if (i === 'notes') {
				var rows = element.all(by.repeater('note in cat.notes'));
				expect(rows.length === 1);
				expect(rows.last().element(by.css('.note')).getText()).toBe(cat.notes[0]);
			}
			else {
				expect(element(by.id(i)).getText()).toBe(cat[i]);
			}
		}
    });

	describe('with pre-existing data', function() {
		beforeEach(function(done) {
			var self = this;
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

            var flow = protractor.promise.controlFlow();
            flow.execute(utils.dropDb);
            flow.execute(function() {
                return utils.db(function(db) {
                    db.collection('contacts').insert(contact, utils.throwIfPresent);
                    var newCat = {
                        name: 'Test Cat',
                        color: 'Green',
                        breed: 'Test Breed',
                        location: 'Test Location',
                        dateOfBirth: '02/15/2014',
                        dateOfArrival: '02/15/2015',
                        temperament: 'Test Temperament',
                        description: 'Test Description'
                    };
                    db.collection('cats').insert(newCat, function (err, cats) {
                        utils.throwIfPresent(err);
                        self.createdCat = cats[0];
                        done();
                    });
                });
            });
		});

		it('should be able to delete cat from database', function() {
			browser.get('/#!/cats/' + this.createdCat._id);
			
			/* delete the cat */
			element(by.id('delete-cat')).click();

			/* check that we went back to the homepage organically */
			expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "/#!/");
            browser.get('/#!/');

			var self = this;
			/* check that the cat doesn't exist anymore */
			element.all(by.repeater('cat in cats')).then(function(cats) {
				for (var i in cats) {
					expect(cats[i].evaluate('cat._id')).not.toBe(self.createdCat._id);
				}
			});
		});

        it('should not be able to add a note if not logged in', function() {
            browser.get('/#!/cats/' + this.createdCat._id);
            var noteText = 'This is a new note.';
            element(by.model('newNote')).sendKeys(noteText);
            element(by.id('add-note')).click();

            browser.get('/#!/cats/' + this.createdCat._id);
            var notes = element.all(by.repeater('note in cat.notes'));
            element.all(by.repeater('note in notes')).then(function(elements) {
                console.log(elements);
            });
            expect(notes.count()).toBe(0);
        });

		it('should be able to add notes to a cat if signed in', function() {

            browser.get('/#!/employees/create');

            var user = {
                firstName: 'First',
                lastName: 'Last',
                email: 'a.h.russ@gmail.com',
                password: 'password'
            };

            /* Create an account */
            element(by.model('firstName')).sendKeys(user.firstName);
            element(by.model('lastName')).sendKeys(user.lastName);
            element(by.model('email')).sendKeys(user.email);
            utils.selectDropdownByNumber(element(by.model('permissionLevel')), 0);
            element(by.buttonText('Create')).click();

            // TODO: Get username and password from server.
            /* Sign In */
            element(by.linkText('Sign In')).click();
            element(by.model('credentials.username')).sendKeys(user.email);
            element(by.model('credentials.password')).sendKeys(user.password);

            /* Actually try to create the note */
			browser.get('/#!/cats/' + this.createdCat._id);
            var noteText = 'This is a new note.';
            element(by.model('newNote')).sendKeys(noteText);
			element(by.id('add-note')).click();

            /* Test that the note was created. */
            var note = element.all(by.repeater('note in cat.notes')).first().element(by.css('.note-message'));
            expect(note.getText()).toBe(noteText);
		});

		it('should be able to get to vet contact info from details page', function() {
			browser.get('/#!/cats/' + this.createdCat._id);
			element(by.id('originPerson')).click();
			expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#!/contacts/' + this.createdCat.origin.person._id);
		});
	});
});
