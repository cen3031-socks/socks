#!/bin/bash


# If python is present on the machine, generate the data fresh, otherwise just use what's
# already been generated in the repository before
if type /usr/bin/python >/dev/null 2>&1; then 
	./generate-cat-data.py > ./cats-data.json
	./generate-contacts.py > ./contacts-data.json
fi

read -p "Do you want to remove pre-existing mongo data? (y/n): "  -n 1 -r
echo 

if [[ $REPLY =~ ^[Yy]$ ]]
then
mongo << EOF
use mean-dev
db.contacts.drop()
db.cats.drop()
db.donations.drop()
EOF
fi 

mongoimport --db mean-dev --collection donations --type json donations.json --jsonArray
mongoimport --db mean-dev --collection cats --type json ./cats-data.json --jsonArray
mongoimport --db mean-dev --collection contacts --type json ./contacts-data.json --jsonArray
