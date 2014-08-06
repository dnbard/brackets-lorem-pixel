define(function(require, exports, module){
    var path = module.uri.replace('config.js', '');
    console.log(path);

    exports.path = path;
});
