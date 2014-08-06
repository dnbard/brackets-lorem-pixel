var fs = require("fileSystemImpl");

define(function(require, exports){
    exports.showSaveDialog = function(callback){
        if (typeof callback !== 'function'){
            throw new Error('Invalid callback');
        }

        fs.showSaveDialog('Save image', './', '', callback);
    }

    exports.saveFile = function(path, data, options, callback){
        fs.writeFile(path, data, options, callback);
    }
});
