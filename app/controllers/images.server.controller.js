'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Image = mongoose.model('Image'),
	_ = require('lodash');

var ImageManager = require('./ImageManager');
var config = require('../../config/config');
var q = require('q');

var uploader = new ImageManager.Uploader(config.fileUploadPath);
uploader.version({
    name: 'thumbnail',
    width: '144',
    height: '144'
}).version({
    name: 'large',
    width: '600',
    height: '480'
}).version({
    name: 'original'
});

exports.create = function(req, res) {
    console.log('Images.create');
	var image = new Image(req.body);
	image.user = req.user;
	image.save(errorHandler.wrap(res, function(image) {
			return res.json(image);
	}));
};

exports.read = function(req, res) {
	res.jsonp(req.image);
};

exports.update = function(req, res) {
	var image = _.extend(req.image, req.body);
	image.save(errorHandler.wrap(res, function() {
        res.jsonp(image);
    }));
};

exports.delete = function(req, res) {
	var image = req.image;
    image.deleted = true;
    res.jsonp(image);
};

exports.deleteAll = function(req, res) {
    if (!req.body.images) {
        return res.status(400).json({messages: 'No images given to delete'});
    }

    var promises = _.map(req.body.images, function(image) {
        var deferred = q.defer();
        Image.findById(image._id).
            remove().
            exec(errorHandler.wrap(res, function() {
                uploader.
                    delete(image._id).
                    then(function() { deferred.resolve(); },
                    function(err) { deferred.reject(err); });
            }));
        return deferred.promise;
    });

    q.all(promises).
        then(function() {
            res.json({ message: 'Successfully deleted' });
        }).
        fail(function(err) {
            errorHandler.sendErrorResponse(res, err);
        });
};

exports.list = function(req, res) {
    Image.find().exec(errorHandler.wrap(res, function(images) {
        res.json(images);
    }));
};

exports.imageByID = function(req, res, next, id) {
    Image.findById(id).populate('tags')
        .exec(function(err, image) {
            if (err) return next(err);
            if (!image) return next(new Error('Failed to load Image ' + id));
            req.image = image;
            next();
        });
};

exports.getVersion = function(version, req, res) {
    if (!req.image[version]) {
        return res.status(400).json({message: 'Image version ' + version + ' does not exist.'});
    } else {
        return res.sendFile(req.image[version], { root: uploader.path });
    }
};

exports.getOriginal = function(req, res) {
    return exports.getVersion('original', req, res);
};

exports.getThumbnail = function(req, res) {
    return exports.getVersion('thumbnail', req, res);
};

exports.getLarge = function(req, res) {
    return exports.getVersion('large', res, res);
};

exports.upload = function(req, res) {
    var image = new Image({});
    uploader.
        process(image._id, req.files.file.path).
        then(function(images) {
            image.thumbnail = images.thumbnail;
            image.large = images.large;
            image.original = images.original;
            image.save(errorHandler.wrap(res, function(image) {
                console.log(image);
                res.json(image);
            }));
        }).
        fail(function(err) { console.log(err); errorHandler.sendErrorResponse(res, err) });
};

exports.forCat = function(req, res) {
    Image.find({tags: req.cat._id}).
        exec(errorHandler.wrap(res, function(images) {
            res.json(images);
        }));
};
