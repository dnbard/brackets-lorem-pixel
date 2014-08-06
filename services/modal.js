define(function(require, exports){
    var Dialogs = brackets.getModule('widgets/Dialogs'),
        modalTemplate = require('text!../templates/modal.html'),
        ko = require('../vendor/knockout'),
        ModalViewModel = require('../viewmodels/modalViewModel');

    function showHandler(){
        var dlg = Dialogs.showModalDialogUsingTemplate(modalTemplate)._$dlg;

        ko.applyBindings(new ModalViewModel(), dlg[0]);
    }

    exports.showHandler = showHandler;
});
