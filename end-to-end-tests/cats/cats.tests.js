var MongoClient = require('mongodb').MongoClient;
var utils       = require('../test-utils.js');

describe('cats homepage', function() {

	beforeEach(function() {
		utils.createUserAndSignIn(browser, element);
	});

	it('should be able to add a cat to database', function() {
		browser.get('/');

		element(by.id('new-cat')).click();

		var cat = {
			name: 'Test Cat',
			color: 'Green',
			breed: 'Siberian', 
			temperament: 'Test Temperament',
			description: 'Test Description',
			originAddress: '1 Somewhere Street'
		};

		for (var i in cat) {
			element(by.model(i)).sendKeys(cat[i]);
		}

		cat.dateOfBirth = '02/15/2014';
		element(by.model('dateOfBirth')).
			element(by.css('input[type="text"]')).
			sendKeys(cat.dateOfBirth);

		cat.sex = 'Male';
		element(by.model('sex')).element(by.css('option[value="1"]')).click();

		element(by.id('submit')).click();

		for (var i in cat) {
			if (i === 'dateOfBirth' || i === 'dateOfArrival') {
				(function(theI) {
					element(by.id(theI)).getText().then(function(text) {
						expect(Date.parse(text)).toBe(Date.parse(cat[theI]));
					}); 
				}(i));
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

		it('should be able to click a cat to get details', function() {
			browser.get('/#!/');
			element.all(by.repeater('cat in cats')).first().click();
			expect(browser.getCurrentUrl()).toContain('/#!/cats/' + this.createdCat._id);
		});

		it('should not be able to add a note if not logged in', function() {
			browser.get('/#!/cats/' + this.createdCat._id);
			var noteText = 'This is a new note.';
			element(by.model('newNote')).sendKeys(noteText);
			element(by.id('add-note')).click();

			browser.get('/#!/cats/' + this.createdCat._id);
			var notes = element.all(by.repeater('note in cat.notes'));
			expect(notes.count()).toBe(0);
		});

		it('should be able to add notes to a cat if signed in', function() {

			/* Actually try to create the note */
			browser.get('/#!/cats/' + this.createdCat._id);
			var noteText = 'This is a new note.';
			element(by.model('newNote')).sendKeys(noteText);
			element(by.id('add-note')).click();

			/* Test that the note was created. */
			var note = element.all(by.repeater('note in notes')).first().element(by.css('.note-message'));
			expect(note.getText()).toBe(noteText);
		});

	});
});
