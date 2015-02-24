describe('cats homepage', function() {
    it('should have a title', function() {
        browser.get('http://localhost:3000');

        expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
    });
    it('should create a cat successfully', function() {
        browser.get('http://localhost:3000/');

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
})
