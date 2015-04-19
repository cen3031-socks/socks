'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ( property.length);
};

/**
 * A Validation function for local strategy password
 */
var checkValidPermissionLevel = function(permissionLevel){
	return (permissionLevel >= 0);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	username: {
		type: String,
		unique: 'Email already exists',
		required: 'Please fill in an email',
		trim: true
	},
	password: {
		type: String,
		default: '',
		required: true
	},
	contact: {
		type: Schema.ObjectId,
		ref: 'Contact',
		required: 'contact is required for user account'
	},
	salt: {
		type: String
	},
	permissionLevel: {
		type: Number,
		default: 0,
		validate: [checkValidPermissionLevel, 'permissionLevel must be >= 0']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	

	//git hub code solution to multiple saving due to async nature.  now it is working.
	var self = this;
    mongoose.models["User"].findOne({username : self.username},function(err, user) {
        //console.log(user);
        if(err) {
            next(err);
        } else if(user) {
            self.invalidate("username","username must be unique");
            next(new Error("username must be unique"));
        } else {
            next();
        }
    });
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};


/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
