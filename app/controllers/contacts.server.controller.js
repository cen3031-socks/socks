'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    users = require('./users.server.controller'),
    Contact = mongoose.model('Contact'), Adoption = mongoose.model('Adoption'), Cat = mongoose.model('Cat'),
    Donation = mongoose.model('Donation'), Volunteer = mongoose.model('Volunteer'), User = mongoose.model('User'),
    _ = require('lodash'),
    q = require('q');

/**
 * Find adopted cats
 */
var cleanPhoneNumber = function (phone) {
    var newPhone = '';
    for (var i = 0; i < phone.length; ++i) {
        if (phone[i].match(/\d/)) {
            newPhone += phone[i];
        }
    }
    return newPhone;
};

var cleanZipCode = function (zipCode) {
    var newZipCode = '';
    for (var i = 0; i < zipCode.length; ++i) {
        if (zipCode[i].match(/\d/)) {
            newZipCode += zipCode[i];
        }
    }
    return newZipCode;
};

exports.findAdoptedCats = function (req, res) {
    Adoption.find({adopter: req.contact._id, endDate: null, adoptionType: 'adoption'}).exec(function (err, adoptions) {
        if (err) {
            return res.status(400);
        }
        Adoption.populate(adoptions, {path: 'catId', model: Cat},
            function (err, adoptions) {
                if (err) {
                    return res.status(400);
                }
                else return res.jsonp(adoptions);
            }
        );
    });
};

exports.determineIfAdopter = function (contact) {
    var deferred = q.defer();
    Adoption.find({adopter: contact._id, adoptionType: 'adoption'}, function (err, adoptions) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(adoptions.length > 0);
    });
    return deferred.promise;
};


exports.findFosteredCats = function (req, res) {
    Adoption.find({adopter: req.contact._id, endDate: null, adoptionType: 'foster'}).exec(function (err, adoptions) {
        if (err) {
            return res.status(400);
        }
        Adoption.populate(adoptions, {path: 'catId', model: Cat},
            function (err, adoptions) {
                if (err) {
                    return res.status(400);
                }
                else return res.jsonp(adoptions);
            }
        );
    });
};

exports.determineIfFosterer = function (contact) {
    var deferred = q.defer();
    Adoption.find({adopter: contact._id, adoptionType: 'foster'}, function (err, adoptions) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(adoptions.length > 0);
    });
    return deferred.promise;
};


exports.findCatsWithVets = function (req, res) {
    Cat.find({vet: req.contact._id}).exec(function (err, cats) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(cats);
    });
};

exports.determineIfVet = function (contact) {
    var deferred = q.defer();
    Cat.find({vet: contact._id}).exec(function (err, cats) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(cats.length > 0);
    });
    return deferred.promise;
};

exports.findDonations = function (req, res) {
    Donation.find({donor: req.contact._id}).exec(function (err, donations) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(donations);
    });
};

exports.determineIfDonator = function (contact) {
    var deferred = q.defer();
    Donation.find({donor: contact._id}).exec(function (err, donations) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(donations.length > 0);
    });
    return deferred.promise;
};

exports.findVolunteerHours = function (req, res) {
    Volunteer.find({contact: req.contact._id}).exec(function (err, volunteers) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(volunteers);
    });
};


exports.determineIfVolunteer = function (contact) {
    var deferred = q.defer();
    console.log(contact._id);
    Volunteer.find({contact: contact._id}).exec(function (err, volunteers) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(volunteers.length > 0);
    });
    return deferred.promise;
};

exports.findEmployees = function (req, res) {
    User.find({contact: req.contact._id, permissionLevel: users.EMPLOYEE}).exec(function (err, users) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(users);
    });
};

exports.determineIfEmployee = function (contact) {
    var deferred = q.defer();
    console.log(contact._id);
    User.find({contact: contact._id, permissionLevel: users.EMPLOYEE}).exec(function (err, users) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(users.length > 0);
    });
    return deferred.promise;
};

exports.findAdmins = function (req, res) {
    User.find({contact: req.contact._id, permissionLevel: users.ADMIN}).exec(function (err, users) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(users);
    });
};

exports.determineIfAdmin = function (contact) {
    var deferred = q.defer();
    console.log(contact._id);
    User.find({contact: contact._id, permissionLevel: users.ADMIN}).exec(function (err, users) {
        if (err) {
            deferred.reject();
        }
        deferred.resolve(users.length > 0);
    });
    return deferred.promise;
};

var promisedBoolean = function(promise) {
    var deferred = q.defer();
    promise.then(function(result) {
        deferred.resolve(result ? 'T' : 'F');
    }, deferred.reject);
    return deferred.promise;
};

exports.generateCsv = function (req, res) {
    var csvFields = {
        'ID': '_id',
        'FirstName': 'firstName',
        'LastName': 'surname', //NOTE, it should display surnames as "LastName" for easy readability
        'Email': 'email',
        'PhoneNumber': 'phone', //NOTE, it should display phone as "PhoneNumber" for easy readability
        'Address': 'address',
        'City': 'city',
        'State': 'state',
        'ZipCode': 'zipCode',

        'Adopter': function (contact) {
            return promisedBoolean(exports.determineIfAdopter(contact));
        },
        'Veterinarian': function (contact) {
            return promisedBoolean(exports.determineIfVet(contact));
        },
        'Fosterer': function (contact) {
            return promisedBoolean(exports.determineIfFosterer(contact));
        },
        'Donator': function (contact) {
            return promisedBoolean(exports.determineIfDonator(contact));
        },
        'Volunteer': function (contact) {
            return promisedBoolean(exports.determineIfVolunteer(contact));
        },
        'Employee': function (contact) {
            return promisedBoolean(exports.determineIfEmployee(contact));
        },
        'Admin': function (contact) {
            return promisedBoolean(exports.determineIfAdmin(contact));
        }

    };
    Contact.find()
        .exec(errorHandler.wrap(res, function (contacts) {
            res.set('Content-Type', 'text/csv');

            var csv = require('./csv.js');
            console.log(csvFields);
            csv.convertToCsv(contacts, csvFields).then(function (csvData) {
                res.send(csvData);
            });
        }));
};

/**
 * Create a Contact
 */
exports.create = function (req, res) {
    var contact = new Contact(req.body);
    contact.user = req.user;
    contact.phone = cleanPhoneNumber(contact.phone);
    contact.zipCode = cleanZipCode(contact.zipCode);

    contact.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(contact);
        }
    });

};


/**
 * Show the current Contact
 */
exports.read = function (req, res) {
    res.jsonp(req.contact);
};

/**
 * Update a Contact
 */
exports.update = function (req, res) {
    var contact = req.contact;

    contact = _.extend(contact, req.body);
    contact.phone = cleanPhoneNumber(contact.phone);
    contact.zipCode = cleanZipCode(contact.zipCode);


    contact.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(contact);
        }
    });
};

/**
 * Delete an Contact
 */
exports.delete = function (req, res) {
    var contact = req.contact;

    contact.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            User.find({contact: contact._id}).remove().exec(errorHandler.wrap(res,
                function() { 
                    res.json({message: 'Successfully deleted.'});
                }));
        }
    });
};

exports.getAllAdopters = function (req, res) {
    Adoption.find().populate('adopter').exec(function (err, adoptions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var adopters = [];
            for (var i = 0; i < adoptions.length; ++i) {
                adopters.push(adoptions[i].adopter);
            }
            return res.jsonp(adopters);
        }
    });
};

/**
 * List of Contacts
 */
exports.list = function (req, res) {
    Contact.find().sort('-created').populate('user', 'displayName').exec(function (err, contacts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(contacts);
        }
    });
};

/**
 * Contact middleware
 */
exports.contactByID = function (req, res, next, id) {
    Contact.findById(id).populate('user', 'displayName').exec(function (err, contact) {
        if (err) return next(err);
        if (!contact) return next(new Error('Failed to load Contact ' + id));
        req.contact = contact;
        next();
    });
};

/**
 * Contact authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.contact.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
