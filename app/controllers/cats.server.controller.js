'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cat = mongoose.model('Cat'),
	Adoption = mongoose.model('Adoption'),
	Donation = mongoose.model('Donation'),
	Contact = mongoose.model('Contact'),
    Report = mongoose.model('Report'),
	_ = require('lodash'),
    async = require('async');

exports.list = function(req, res) {
	Cat.find().sort('name').exec(function(err, cats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cats);
		}
	});
};

exports.view = function(req, res) {
    res.json(req.cat);
};

function isValidEvent(event) {
	// TODO: better event validation
	return true;
}

exports.addEvent = function(req, res) {
	if (!isValidEvent(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var cat = req.cat;
	var event = req.body;
	event._id = mongoose.Types.ObjectId();
	cat.events.push(event);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[cat.events.length - 1]);
		}
	});
};

exports.adopt = function(req, res) {
    console.log(req.body);
	if (req.cat.currentAdoption !== undefined) {
		return res.status(400).send({
			message: 'Cannot adopt cat with current adopter.'
		});
	}
	var adoption = new Adoption(req.body);
	adoption.catId = req.cat._id;
	adoption.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.cat.adoptions.push(adoption._id);
			req.cat.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(adoption);
				}
			});
		}
	});
};

exports.unadopt = function(req, res) {
	var adoption = req.adoption;
	adoption.endDate = req.body.endDate;
	adoption.returnReason = req.body.reason;
	req.cat.currentAdoption = undefined;
	adoption.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Cat.findById(adoption.catId).populate('adoptions currentAdoption')
		.exec(function(err, cat) {
			// this is ugly....
			Cat.populate(cat, { 
				path: 'adoptions.adopter currentAdoption.adopter', 
				model: Contact
			}, function(err, cat) {
				Cat.populate(cat, { path: 'adoptions.donation currentAdoption.donation', model: Donation},
					function(err, cat) {
						if (err || !cat) {
							return res.status(404).send({
								message: errorHandler.getErrorMessage(err)
							});
						}
						cat.currentAdoption = undefined;							
						cat.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								console.log(req.cat);
								res.json({message: 'Deleted successfully'});
							}
						});
					});
			});
		});
		}
	});
};

exports.editEvent = function(req, res) {
	if (!isValidEvent(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var cat = req.cat;
	cat.events[req.params.eventIndex] = req.body;
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[req.params.eventIndex]);
		}
	});
};

exports.deleteEvent = function(req, res) {
	var cat = req.cat;

	var index = -1;
	for (var i in cat.events) {
		if (cat.events[i]._id.toString() === req.params.eventId) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		return res.status(404).send({
			message: 'That event does not exist with this cat.'
		});
	}
	cat.events.splice(index, 1);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({message: 'The event was successfully deleted.'});
		}
	});
};

exports.adoptionById = function(req, res, next, id) {
	Adoption.findById(id).exec(function(err, adoption) {
		if (err) {
			next(err);
		} else {
			req.adoption = adoption;
			if (!adoption) {
				return res.status(404).send({
					message: 'Adoption not found'
				});
			} else if (adoption.catId !== req.params.catId && req.params.catId !== undefined && false) {
				return res.status(400).send({
					message: 'That adoption does not correspond to the given cat.'
				});
			}
			next();
		}
	});	
};

exports.catById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Cat is invalid'
        });
    }
    Cat.findById(id).populate('adoptions currentAdoption vet origin.person profileImage')
		.exec(errorHandler.wrap(res, function(cat) {
		// this is ugly....
			Cat.populate(cat, { 
				path: 'adoptions.adopter currentAdoption.adopter', 
				model: Contact
			}, errorHandler.wrap(res, function(cat) {
				Cat.populate(cat, { path: 'adoptions.donation currentAdoption.donation', model: Donation},
					function(err, cat) {
						if (err) return next(err);
						if (!cat) {
							return res.status(404).send({
								message: 'Cat not found'
							});
						}
						req.cat = cat;
						next();
					});
			}));
		}));
};

exports.create = function(req, res) {
    console.log(req.body);
	var cat = new Cat(req.body);
	cat.save(errorHandler.wrap(res, function(cat) {
            res.json(cat);
        }));
};

exports.getCatAge = function(cat) {
    return Math.floor((Date.now() - cat.dateOfBirth) / (1000 * 86400 * 365));
};

exports.getAgeClassFromAge = function(age) {
    if (age < 2) {
        return 'Baby';
    } else if (age < 5) {
        return 'Kitten';
    } else if (age < 10) {
        return 'Adult';
    } else {
        return 'Senior';
    }
};

/**
 * Gets the cat status for PetFinder from the cat. The following are possible
 * values and their meanings:
 *
 *      A      adoptable
 *      H      hold -- kept in the shelter; not adoptable
 *      X      adopted
 *      P      pending
 *
 * Right now we only return A or X
 *
 * @param cat
 * @returns {string}    one of 'A', 'H', 'X', or 'P'
 */
exports.getCatStatus = function(cat) {
    if (cat.currentAdoption) {
        // adopted
        return 'X';
    } else {
        // adoptable
        return 'A';
    }
};

exports.generateCsv = function(req, res) {
    var csvFields = {
        'ID' : '_id',
        'Internal': function() { return ''; },
        'AnimalName': 'name',
        'PrimaryBreed': 'breed',
        'SecondaryBreed': function() { return ''; },
        'Sex': function(cat) { return cat.sex === 1 ? 'M' : 'F'; },
        'Size': function(cat) { return 'M'; },
        'Age': function(cat) { return exports.getAgeClassFromAge(exports.getCatAge(cat)); },
        'Desc': 'description',
        'Type': function(cat) { return 'Cat'; },
        'Status': exports.getCatStatus,
        'Shots': function(cat) { return '1'; },
        'Altered': function(cat) { return ''; },
        'NoDogs': function(cat) { return ''; },
        'NoKids': function(cat) { return ''; },
        'Housetrained': function(cat) { return ''; },
        'Declawed': function(cat) { return ''; },
        'specialNeeds': function(cat) { return ''; },
        'Mix': function(cat) { return ''; },
        'photo1': function(cat) { return ''; },
        'photo2': function(cat) { return ''; },
        'photo3': function(cat) { return ''; }
    };
    Cat.find()
       .exec(errorHandler.wrap(res, function(cats) {
            res.set('Content-Type', 'text/csv');
            var csv = require('./csv.js');
            csv.convertToCsv(cats, csvFields).
                then(function(csvData) {
                    res.send(csvData);

                }).
                fail(function(err) {
                    errorHandler.sendErrorResponse(res, err);
                });
        }));
};

exports.getMostRecentOperationOfType = function(cat, shotType) {
    var operation = undefined;
    var date = undefined;
    for (var i = 0; i < cat.events.length; ++i) {
        var thisEvent = cat.events[i];
        if (thisEvent && thisEvent.eventType === 'vet') {
            if (thisEvent.data && thisEvent.data.operations) {
                var operations = thisEvent.data.operations;
                for (var j = 0; j < operations.length; ++j) {
                    if (operations[j].type === shotType) {
                        if (!date || thisEvent.date > date) {
                            operation = operations[j];
                            date = thisEvent.date;
                        }
                    }
                }
            }
        }
    }
    if (operation) operation.date = date;
    return operation;
};

exports.filters = {
    'Adopted': function(filter, cat) {
        if (cat.currentAdoption) console.log(cat.currentAdoption.date);
        return cat.currentAdoption
                    && !cat.currentAdoption.endDate
                    && cat.currentAdoption.adoptionType === 'adoption'
                    && (!filter.startDate || cat.currentAdoption.date >= new Date(filter.startDate))
                    && (!filter.endDate   || cat.currentAdoption.date <= new Date(filter.endDate));
    },
    'ArrivalDate': function(filter, cat) {
        return cat.dateOfArrival
            && (!filter.startDate || cat.dateOfArrival >= new Date(filter.startDate))
            && (!filter.endDate   || cat.dateOfArrival <= new Date(filter.endDate));
    },
    'Deceased': function(filter, cat) {
        if (cat.events) {
            for (var i = 0; i < cat.events.length; ++i) {
                if (cat.events[i].eventType === 'deceased') {
                    var date = cat.events[i].date;
                    return date
                        && (!filter.startDate || date >= new Date(filter.startDate))
                        && (!filter.endDate || date <= new Date(filter.endDate));
                }
            }
        }
        else return false;
    },
    'Breed': function(filter, cat) {
        if (!filter.breeds) { return false; }
        for (var i = 0; i < filter.breeds.length; ++i) {
            if (filter.breeds[i] === cat.breed) {
                return true;
            }
        }
        return false;
    },
    'Sex': function(filter, cat) {
        return parseInt(filter.sex) === cat.sex;
    },
    'Age': function(filter, cat) {
        var catAge = exports.getCatAge(cat);
        return (!filter.minAge || filter.minAge <= catAge) && (!filter.maxAge || filter.maxAge >= catAge);
    },

    /**
     * Checks if a cat has had a shot of a given type since a given date
     * @param filter
     * @param cat
     * @returns {boolean}
     */
    'HasHadOperation': function(filter, cat) {
        var shotType = filter.operation;
        var date = filter.date;
        var operation = exports.getMostRecentOperationOfType(cat, shotType);
        return (operation && (!date || shot.date >= new Date(date)));
    },

    'Origin': function(filter, cat) {
        if (filter.originType === 'Organization') {
            return cat.origin.organization === filter.originOrganization;
        } else if (filter.originType === 'Person') {
            return _.contains(_.map(filter.people, function(p) { return p._id; }), cat.origin.person);
        }
    }
};

exports.searchCats = function(req, res) {
    var report = req.report;
    if (_.any(report.filters, function(f) { return !exports.filters[f.type]; })) {
        return res.status(400).json({ message: 'Unknown filter type'});
    }
    Cat.find().populate('currentAdoption')
        .exec(errorHandler.wrap(res, function(cats) {
            var matchType = report.matchType;
            var filtered = [];
            for (var i = 0; i < cats.length; ++i) {
                var cat = cats[i];
                var matchesFilter = true;
                for (var j = 0; j < report.filters.length; ++j) {
                    var filter = report.filters[j];
                    var filterResult = exports.filters[filter.type](filter, cat);
                    if (matchType === 'all') {
                        if (filter.invert) {
                            matchesFilter = matchesFilter && !filterResult;
                        } else {
                            matchesFilter = matchesFilter && filterResult;
                        }
                    } else if (matchType === 'any' || matchType === 'none') {
                        if (filter.invert !== filterResult) {
                            filtered.push(cat);
                        }
                    }
                }
                if (matchType === 'all' && matchesFilter) {
                    filtered.push(cat);
                }
            }
            if (matchType === 'none') {
                filtered = _.difference(cats, filtered);
            }
            filtered = _.uniq(filtered);
            res.send(filtered);
        }));

};

exports.update = function(req, res) {
    var cat = _.assign(req.cat, req.body);
    console.log(req.body);
    cat.save(errorHandler.wrap(res, function(cat) { res.json(cat) }));
};
