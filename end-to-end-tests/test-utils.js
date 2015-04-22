var MongoClient = require('mongodb').MongoClient;

/**
 * Connect to the database and execute a callback when you're connected
 * Blocks until the query is completed.
 *
 * @param callback  a callback function which takes the database as a parameter
 */
exports.db = function(callback) {
    var defer = protractor.promise.defer();
    MongoClient.connect('mongodb://localhost:27017/mean-dev', function(err, db) {
        if (!!err)  {
            console.log('connection to db failed', err);
            defer.reject({error: err});
        } else {
            callback(db);
            defer.fulfill();
        }
    });
    return defer.promise;
};

exports.throwIfPresent = function(err) {
    if (err) {
        throw err;
    }
};

exports.createUserAndSignIn = function(browser, element) {
    var flow = protractor.promise.controlFlow();
    flow.execute(exports.dropDb);
    browser.get('/activate');
    element(by.model('username')).sendKeys('email@email.com');
    element(by.model('password')).sendKeys('password');
    element(by.model('firstName')).sendKeys('John');
    element(by.model('lastName')).sendKeys('Smith');
    element(by.buttonText('Submit')).click();

    browser.get('/#!/signin');
    element(by.model('credentials.username')).sendKeys('email@email.com');
    element(by.model('credentials.password')).sendKeys('password');
    element(by.buttonText('Sign in')).click();
};

/**
 * Drop all the data from the database
 * @returns {promise} a promise which will be fulfilled if the database is successfully droped.
 */
exports.dropDb = function dropDb() {
    return exports.db(function(db) {
        db.dropDatabase();
    });
};

exports.selectDropdownByNumber = function(element, index) {
    element
        .all(by.tagName('option'))
        .then(function(options) {
            options[index].click();
        });
}
