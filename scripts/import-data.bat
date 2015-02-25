mongoimport --db mean-dev --collection donations --type json donations.json --jsonArray
mongoimport --db mean-dev --collection cats --type json ./cats-data.json --jsonArray
mongoimport --db mean-dev --collection contacts --type json ./contacts-data.json --jsonArray
