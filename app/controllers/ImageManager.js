var async = require('async');
var gm = require('gm');
var q = require('q');
var fs = require('fs');
var _ = require('lodash');


exports.Uploader = function(path, useImageMagick) {

    var ImageMagick = gm;
    if (useImageMagick) {
        ImageMagick = ImageMagick.subClass({imageMagick: true});
    }

    this.path = path || './images/uploads';
    this.versions = {};

    var uploader = this;

    this.version = function(settings) {
        if (settings.name && ((settings.width && settings.height) || settings.name === 'original')) {
            uploader.versions[settings.name] = {
                name: settings.name,
                width: settings.width,
                height: settings.height
            }
        } else {
            throw new Error('Image version needs a name, width, and height');
        }
        return this;
    };

    this.getVersionsArray = function() {
        var array = [];
        for (var i in uploader.versions) {
            array.push(uploader.versions[i]);
        }
        return array;
    };

    this.resizeOne = function(newFilename, existingFilePath) {
        return function(version) {
            var relativeFilePath = newFilename + '-' + version.name + '.png';
            var newFilePath = uploader.path + '/' + relativeFilePath;
            var deferred = q.defer();
            console.log('resizing image ' + newFilePath);
            var image = ImageMagick(existingFilePath);

            if (version.name !== 'original') {
                image = image.resize(version.width, version.height);
            }
            image.write(newFilePath, function(err) {
                console.log('wrote image ' + newFilePath);
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(relativeFilePath);
                }
            });
            return deferred.promise;
        }
    };

    this.process = function(newFilename, existingFile) {
        console.log('processing image ' + newFilename);
        var deferred = q.defer();

        var versions = uploader.getVersionsArray();
        q.all(_.map(versions, uploader.resizeOne(newFilename, existingFile))).
            then(function(filenames) {
                var images = {};
                for (var i = 0; i < versions.length; ++i) {
                    images[versions[i].name] = filenames[i];
                }
                deferred.resolve(images);
            }).
            fail(deferred.reject);
        return deferred.promise;
    };
};

