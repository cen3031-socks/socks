console.log('Adding data to database.');
var MongoClient = require('mongodb').MongoClient;

console.log('Loading cat data.');
var cats = require('./cats-data.json');

console.log('Loading contact data.');
var contacts = require('./contacts-data.json');

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
		db.collection('contacts').insert(contacts.slice(0, 20), function(err, dbcontacts){
			var donations = [];
			var names=['Food', 'Monetary', 'Supplies'];
			var unit=['lbs', 'dollars', 'supplies'];
			var icons=['glyphicon glyphicon-heart', 'glyphicon glyphicon-usd', 'glyphicon glyphicon-wrench'];
			for(var i=0; i<80; i++)
			{
				//console.log('inside for loop');
				var randomIndex=Math.floor(Math.random()*dbcontacts.length);
				var contact=dbcontacts[randomIndex];
				var numberOfItems=Math.floor(Math.random()*15)+1;
				var itemsArr = [];

				for(var j=0; j<numberOfItems; j++)
				{
					//console.log('second for loop');
					var randomItemIndex=Math.floor(Math.random()*4);

					itemsArr.push({
						name:names[randomItemIndex],
						icon:icons[randomItemIndex],
						description:'',
						value:{
							amount:(Math.round((Math.random()*100)*100))/100,
							units:unit[randomItemIndex]
						}
					});
				}

				//console.log(itemsArr);

				donations.push({
					donor:contact._id,
					created:Date.now(), 
					items:itemsArr
				});
			}
			//console.log(donations);
			console.log('Inserting donation data.');
			db.collection('donations').insert(donations, throwIfExists);
			db.close();
			process.exit();
		});
		console.log('Inserting cat data.');
		db.collection('cats').insert(cats.slice(0, 20), throwIfExists);

});
