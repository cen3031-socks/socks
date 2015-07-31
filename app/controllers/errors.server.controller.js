'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

	} catch (ex) {
		output = 'Unique field already exists';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Check if there's an error and send the error response if there was one
 *
 * @param {Object}   res            the response object
 * @param {Object}   err            the error to check for
 * @param {int}     [statusCode]    the status code to send, defaults to 400
 * @returns {Boolean}  true if there was an error, false if there wasn't
 */
exports.sendErrorResponse = function(res, err, statusCode) {
    if (err) {
        var status = statusCode || 400;
        res.status(status).json({message: exports.getErrorMessage(err)});
        return true;
    }
    return false;
};

/**
 * Wraps up a callback function whose first parameter is the error;
 * only invokes the callback if there's no error and removes the
 * error parameter if it does
 *
 * @param res
 * @param callback
 * @returns {Function}
 */
exports.wrap = function(res, callback) {
    return function(err) {
        if (exports.sendErrorResponse(res, err)) {
            console.error(err);
        } else {
            callback.apply(this, [].slice.call(arguments, 1));
        }
    };
};
