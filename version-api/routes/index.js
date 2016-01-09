/**
 * This module loads dynamically all routes modules located in the routes/
 * directory.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (app) {
  fs.readdirSync(__dirname).forEach(function (file) {
    // Avoid to read this current file.
    if (file === path.basename(__filename)) { return; }

    // Load the route file.
    require('./' + file)(app);
  });
};
