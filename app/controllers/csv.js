/**
 * Takes properties as in whatever form they're given and returns them as an array
 * of objects, where each object has two properties: columnName and getProperty
 *
 * @param properties
 * @returns {Array}
 */
var normalizeProperties = function(properties) {
    var props = [];
    if (!properties) {
        for (var i in items[0]) {
            if (items[0].hasOwnProperty(i)) {
                props.push({ columnName: i, propertyName: i });
            }
        }
    } else if (Object.prototype.toString.call(properties) === '[object Array]') {
        for (var i = 0; i < properties.length; ++i) {
            props.push({ columnName: properties[i], propertyName: properties[i] });
        }
    } else if (typeof(properties) === typeof({k:'v'})) {
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                if (typeof(properties[i]) == typeof(function(item){})) {
                    props.push({ columnName: i, getProperty: properties[i] });
                } else {
                    props.push(
                        {
                            columnName: i,
                            getProperty: (function(property) {
                                return function (item) {
                                    return item[property];
                                }
                            }(properties[i]))
                        });
                }
            }
        }
    }
    return props;
};

/**
 * Converts a list of items to CSV data. The columns in the CSV file are the properties given
 * by properties.
 * @param {Array}           items               the array of items to use as each row
 * @param {Array|Object}    [properties]        the properties of each items to use. If it is an array of strings,
 *                                                  each item of the array is used as a column; the column
 *                                                  label will be the same as the property name. If it's an array of objects
 *                                                  object, each key will be a property of each element of
 *                                                  items to use, and each value will be the associated column
 *                                                  label. If it's excluded, all properties of the first item
 *                                                  in the list will be used.
 * @param {String}          [separator]         the character to use between each value in the file. Defaults to ','
 * @param {Boolean}         [excludeHeaders]    true iff the headers should be excluded. Defaults to false
 */
exports.convertToCsv = function(items, properties, separator, excludeHeaders) {
    if (items.length === 0 || properties.length === 0) {
        return null;
    }
    var props = normalizeProperties(properties);

    // if separator is omitted set it
    separator = separator || ',';

    var csv = '';

    // print the header
    if (!excludeHeaders) {
        for (var i = 0; i < properties.length; ++i) {
            csv += '"' + properties[i].columnName + '"';
            if (i != properties.length - 1) {
                csv += separator;
            }
        }
    }

    for (var i = 0; i < items.length; ++i) {
        for (var j = 0; j < props.length; ++j) {
            csv += '"' + props[j].getProperty(items[i]) + '"';
            if (j !== props.length - 1) {
                csv += separator;
            }
        }
        csv += '\n';
    }
    return csv;
};
