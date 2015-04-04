'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contact = mongoose.model('Contact'), Adoption = mongoose.model('Adoption'), Cat = mongoose.model('Cat'),
    Donation = mongoose.model('Donation'),
	_ = require('lodash');

/**
 * Find adopted cats
 */
//
//function exec(callback) {
//    // get the stuff
//    results = [..];
//    callback(error, results);
//}

exports.findAdoptedCats = function(req, res) {
    Adoption.find({adopter: req.contact._id, endDate: null}).exec(function(err, adoptions) {
        if (err) {
           return res.status(400);
        }
        Adoption.populate(adoptions, { path: 'catId', model: Cat},
            function(err, adoptions) {
                if (err) {
                    return res.status(400);
                }
                else return res.jsonp(adoptions);
            }
        );
    });
}

exports.findCatsWithVets = function(req, res) {
    Cat.find({vet: req.contact._id}).exec(function(err, cats) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(cats);
    });
}

exports.findDonations = function(req, res) {
    Donation.find({donation: req.contact._id}).exec(function(err, donations) {
        if (err) {
            return res.status(400);
        }
        else return res.jsonp(donations);
    });
}

/**
 * Create a Contact
 */
exports.create = function(req, res) {
	var contact = new Contact(req.body);
	contact.user = req.user;
    contact.phone = cleanPhoneNumber(contact.phone);
    contact.zipCode = cleanZipCode(contact.zipCode);

	contact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contact);
		}
	});

};

var cleanPhoneNumber = function(phone) {
    var newPhone = "";
    for (var i = 0; i < phone.length; ++i){
        if (phone[i].match(/\d/)){
            newPhone += phone[i];
        }
    }
    return newPhone;
}

var cleanZipCode = function(zipCode) {
    var newZipCode = "";
    for (var i = 0; i < zipCode.length; ++i){
        if (zipCode[i].match(/\d/)){
            newZipCode += zipCode[i];
        }
    }
    return newZipCode;
}


/**
 * Show the current Contact
 */
exports.read = function(req, res) {
	res.jsonp(req.contact);
};

/**
 * Update a Contact
 */
exports.update = function(req, res) {
	var contact = req.contact ;

	contact = _.extend(contact , req.body);
    contact.phone = cleanPhoneNumber(contact.phone);
    contact.zipCode = cleanZipCode(contact.zipCode);


    contact.save(function(err) {
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
exports.delete = function(req, res) {
	var contact = req.contact;

	contact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contact);
		}
	});
};

exports.getAllAdopters = function(req, res) {
    Adoption.find().populate('adopter').exec(function(err, adoptions) {
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
exports.list = function(req, res) { 
	Contact.find().sort('-created').populate('user', 'displayName').exec(function(err, contacts) {
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
exports.contactByID = function(req, res, next, id) { 
	Contact.findById(id).populate('user', 'displayName').exec(function(err, contact) {
		if (err) return next(err);
		if (! contact) return next(new Error('Failed to load Contact ' + id));
		req.contact = contact ;
		next();
	});
};

/**
 * Contact authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contact.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.deleteNote = function(req, res) {
    var contact = req.contact;
    var note = req.body;
    note._id = mongoose.Types.ObjectId();

    var index = -1;
    for (var i in contact.notes) {
        if (contact.notes[i]._id.toString() === req.params.noteId) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        return res.status(404).send({
            message: 'That note does not exist with this contact.'
        });
    }

    contact.notes.splice(index, 1);
    contact.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({message: "Succesfully deleted."});
        }
    });
};

exports.addNote = function(req, res) {
    var contact = req.contact;
    var note = req.body;
    note._id = mongoose.Types.ObjectId();
    contact.notes.push(req.body);
    contact.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(contact.notes[contact.notes.length - 1]);
        }
    });
};
