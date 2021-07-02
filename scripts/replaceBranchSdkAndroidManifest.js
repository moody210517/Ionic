'use strict'
var fs = require('fs')

module.exports = function(context) {

    var originalFilePath = 'plugins/branch-cordova-sdk/src/scripts/android/updateAndroidManifest.js'
    var customFilePath = 'scripts/updateAndroidManifest.js'

    fs.readFile(customFilePath, 'utf8', function (err,data) {
        if (err) {
            console.log('read data from customUpdateAndroidManifest error');
            console.error(err);
        }

        console.log('read data from customUpdateAndroidManifest success');
      
        fs.writeFile(originalFilePath, data, 'utf8', function (err) {
            if (err) {
               console.log('write data to updateAndroidManifest error');
               console.error(err);
            }
            console.log('write data to updateAndroidManifest success');
        });
    });
}