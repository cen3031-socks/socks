#!/bin/bash
./generate-cat-data.py > ./cats-data.json
mongoimport --db mean-dev --collection donations --type json donations.json --jsonArray
mongoimport --db mean-dev --collection cats --type json ./cats-data.json --jsonArray
