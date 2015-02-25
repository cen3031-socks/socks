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
			browser.get('/#!/');
			browser.waitForAngular();
			var self = this;
			browser.executeAsyncScript(function(callback) {
				/* Make sure there's at least one cat in the db */
				var element = document.querySelector('.cat-grid');
				var scope = angular.element(element).scope();
				var newCat = {
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
				scope.$apply(function() {
					for (var attr in newCat) {
						scope[attr] = newCat[attr];
					}
				});
				scope.create().then(callback);
			}).then(function(data) {
				self.createdCatId = data._id;
			}).then(done);
		});

		it('should be able to delete cat from database', function() {
			browser.get('/#!/cats/' + this.createdCatId);
			
			/* delete the cat */
			element(by.id('delete-cat')).click();

			browser.get('/#!/');
			/* check that we went back to the homepage organically */
			expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "/#!/");
			
			var self = this;
			/* check that the cat doesn't exist anymore */
			element.all(by.repeater('cat in cats')).then(function(cats) {
				for (var i in cats) {
					expect(cats[i].evaluate('cat._id')).not.toBe(self.createdCatId);
				}
			});
		});

		it('should be able to add notes to a cat', function() {
			browser.get('/#!/cats/' + this.createdCatId);

			/* TODO: add user info checking to cat notes test */
			var newNote = element(by.id('new-note'));
			newNote
				.element(by.model('new-note-value'))
				.sendKeys('This is a new note.');
			newNote.element(by.id('add-note')).click();
		});
	});

});
