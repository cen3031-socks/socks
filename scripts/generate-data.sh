#!/bin/bash


# If python is present on the machine, generate the data fresh, otherwise just use what's
# already been generated in the repository before
if type /usr/bin/python >/dev/null 2>&1; then 
	./generate-cat-data.py > ./cats-data.json
	./generate-contacts.py > ./contacts-data.json
fi


	echo "Removing pre-existing mongo data..."
	mongo << EOF
	use mean-dev
	db.contacts.drop()
	db.cats.drop()
	db.donations.drop()
EOF
 

echo "Importing donations data..."
mongoimport --db mean-dev --collection donations --type json donations.json --jsonArray
echo "Importing cat data..."
mongoimport --db mean-dev --collection cats --type json ./cats-data.json --jsonArray
echo "Importing contacts data..."
mongoimport --db mean-dev --collection contacts --type json ./contacts-data.json --jsonArray
