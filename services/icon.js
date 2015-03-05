define(function(require, exports, module){
    var config = require('../config'),
        icon = null;

    function init(){
        var imagePath = config.path + 'images/icon.svg';

        icon = $('<a title="Lorem Pixel" id="lorempixel_icon"></a>');

        icon.css('background', 'url(' + imagePath + ')');
        icon.appendTo($("#main-toolbar .buttons"));
    }

    function click(handler){
        if (icon === null){
            throw new Error('Icon is not initialized');
        }

        icon.on('click', handler);
    }

    exports.init = init;
    exports.click = click;
});
