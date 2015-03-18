console.log('Adding data to database.');
var MongoClient = require('mongodb').MongoClient;

console.log('Loading cat data.');
var cats = require('./cats-data.json');

console.log('Loading contact data.');
var contacts = require('./contacts-data.json');

console.log('Loading donation data.');
var donations = require('./donations.json');

var throwIfExists = function(arg) {
	if (arg) throw arg;
}

MongoClient.connect('mongodb://localhost/mean-dev', function(err, db) {
		console.log('connected to mongo');
		if (err) throw err;

		console.log('cleaning old data from db');
		db.collection('contacts').drop();
		db.collection('cats').drop();
		db.collection('donations').drop();

		console.log('Inserting contact data.');
		db.collection('contacts').insert(contacts.slice(0, 20), throwIfExists);

		console.log('Inserting cat data.');
		db.collection('cats').insert(cats.slice(0, 20), throwIfExists);

		console.log('Inserting donation data.');
		db.collection('donations').insert(donations, throwIfExists);
		db.close();
		process.exit();
});
