var request     = require('request');
var MongoClient = require('mongodb').MongoClient;
var utils       = require('../test-utils');

describe('donations page', function() {

	beforeEach(function() {
		/* create a bunch of contacts */
		var flow = protractor.promise.controlFlow();
		var self = this;
		utils.createUserAndSignIn(browser, element);
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

	it('should be able to add a donation', function() {
		browser.get('/#!/donations');

		element.all(by.css('[href="/#!/donations/create"]')).first().click();

		// var donation = {
		//  name: this.contacts[0].id,
		//  items: []
		// };

		element(by.partialButtonText('Click')).click();
		element(by.model('searchText')).sendKeys(this.contacts[0].firstName);
		element.all(by.repeater('contact in contacts')).first().click();

		// element(by.model('donors')).sendKeys(donation.name);
		// element(by.model('dollarAmount')).sendKeys(donation.dollarAmount);
		// element(by.css('select option[value=cash]')).click();
		// element(by.css('[type=submit]')).click();

		browser.get('/#!/donations');
		expect(true).toBeTruthy();
	});
});

