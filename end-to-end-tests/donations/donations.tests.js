var request = require('request'),
	MongoClient = require('mongodb').MongoClient;

describe('donations page', function() {
	it('should be able to add a donation', function() {
		browser.get('/#!/donations');

		element.all(by.css('[href="/#!/donations/create"]')).first().click();

		var donation = {
			name: 'Bob',
			dollarAmount: 10,
			paymentType: 'cash'
		};

		element(by.model('name')).sendKeys(donation.name);
		element(by.model('dollarAmount')).sendKeys(donation.dollarAmount);
		element(by.css('select option[value=cash]')).click();
		element(by.css('[type=submit]')).click();

		browser.get('/#!/donations');
		expect(element
					.all(
						by.repeater('donation in donations')
						  .column('donation.name'))
					.map(function(e) { return e.getText(); }))
			.toContain(donation.name);
		
	});
});

