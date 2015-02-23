#!/bin/bash
mongoimport --db mean-dev --collection donations --type json donations.json --jsonarray
