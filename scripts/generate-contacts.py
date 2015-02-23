#!/usr/bin/python

names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael",
"Elizabeth", "William", "Linda", "David", "Barbara", "Richard", "Susan", "Joseph",
"Margaret", "Charles", "Jessica", "Thomas", "Dorothy", "Christopher", "Sarah", "Daniel",
"Karen", "Matthew", "Nancy", "Donald", "Betty", "Anthony", "Lisa", "Paul", "Sandra",
"Mark", "Helen", "George", "Ashley", "Steven", "Donna", "Kenneth", "Kimberly", "Andrew",
"Carol", "Edward", "Michelle", "Joshua", "Emily", "Brian", "Amanda", "Kevin", "Melissa",
"Ronald", "Deborah", "Timothy", "Laura", "Jason", "Stephanie", "Jeffrey", "Rebecca",
"Gary", "Sharon", "Ryan", "Cynthia", "Nicholas", "Kathleen", "Eric", "Ruth", "Jacob",
"Anna", "Stephen", "Shirley", "Jonathan", "Amy", "Larry", "Angela", "Frank", "Virginia",
"Scott", "Brenda", "Justin", "Pamela", "Brandon", "Catherine", "Raymond", "Katherine",
"Gregory", "Nicole", "Samuel", "Christine", "Benjamin", "Janet", "Patrick", "Debra",
"Jack", "Samantha", "Dennis", "Carolyn", "Jerry", "Rachel", "Alexander", "Heather",
"Tyler", "Maria", "Henry", "Diane", "Douglas", "Frances", "Peter", "Joyce", "Aaron",
"Julie", "Walter", "Emma", "Jose", "Evelyn", "Adam", "Martha", "Zachary", "Joan",
"Harold", "Kelly", "Nathan", "Christina", "Kyle", "Lauren", "Carl", "Judith", "Arthur",
"Alice", "Gerald", "Victoria", "Roger", "Doris", "Lawrence", "Ann", "Keith", "Jean",
"Albert", "Cheryl", "Jeremy", "Marie", "Terry", "Megan", "Joe", "Kathryn", "Sean",
"Andrea", "Willie", "Jacqueline", "Jesse", "Gloria", "Austin", "Teresa", "Christian",
"Janice", "Ralph", "Sara", "Billy", "Rose", "Bruce", "Hannah", "Bryan", "Julia", "Roy",
"Theresa", "Eugene", "Judy", "Ethan", "Grace", "Louis", "Beverly", "Wayne", "Denise",
"Jordan", "Marilyn", "Harry", "Mildred", "Russell", "Amber", "Alan", "Danielle", "Juan",
"Brittany", "Philip", "Olivia", "Randy", "Diana", "Dylan", "Jane", "Howard", "Lori",
"Vincent", "Madison", "Bobby", "Tiffany", "Johnny", "Kathy", "Phillip", "Tammy", "Shawn",
"Crystal"]

lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller",
"Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
"Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
"Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill",
"Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez",
"Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
"Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy",
"Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson",
"Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett",
"Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long",
"Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales",
"Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"]

streetNames = [ "Second", "Third", "First", "Fourth ", "Park", "Fifth", "Main", "Sixth",
"Oak", "Seventh", "Pine", "Maple", "Cedar", "Eighth", "Elm", "View", "Washington",
"Ninth", "Lake", "Hill"]

streetTypes = ["Rd", "Ave", "St", "Ct", "Cir", "Blvd", "Ln"]

import random

def get_digit():
    return random.choice([str(i) for i in range(1,10)])

def make_phone_number():
    area_code = "".join([get_digit() for i in range(0, 3)])
    exchange = "".join([get_digit() for i in range(0, 3)])
    last_four = "".join([get_digit() for i in range(0, 4)])
    return "(%s) %s - %s" % (area_code, exchange, last_four)

def make_address():
    number = random.randint(0, 1000)
    streetName = random.choice(streetNames)
    streetType = random.choice(streetTypes)
    return "%d %s %s." % (number, streetName, streetType)

def make_contact():
    first_name = random.choice(names)
    last_name = random.choice(lastNames)
    return {"firstName" : first_name,
    "surname" : last_name,
    "address" : make_address(),
    "city" : random.choice(["Orlando", "Gainesville", "Tallahassee", "Jacksonville", "Miami", "Tampa"]),
    "state" : "FL",
    "zipCode" : "32" + "".join([get_digit() for i in range(0,3)]),
    "phone" : make_phone_number(),
    "email" : "%s.%s@example.com" % (first_name.lower(), last_name.lower())}

contacts = []
for i in range(0, 50):
    contacts.append(make_contact())

import json
print json.dumps(contacts)


    
