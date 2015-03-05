define(function(require, exports, module){
    var path = module.uri.replace('config.js', '').replace(' ','%20');
    exports.path = path;
});
