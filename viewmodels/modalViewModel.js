define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = brackets.getModule('thirdparty/lodash'),
        fs = require('../services/filesystem'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        nodeConnection = new NodeConnection();

    function chain() {
        var functions = Array.prototype.slice.call(arguments, 0);
        if (functions.length > 0) {
            var firstFunction = functions.shift();
            var firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }

    function connect() {
        var connectionPromise = nodeConnection.connect(true);
        connectionPromise.fail(function () {
            console.error("[brackets-simple-node] failed to connect to node");
        });
        return connectionPromise;
    }


    function loadClipboard() {
        var path = ExtensionUtils.getModulePath(module, "node/clipboard");
        var loadPromise = nodeConnection.loadDomains([path], true);
        loadPromise.fail(function (e) {
            console.log(e);
            console.log("[brackets-simple-node] failed to load clipboard");
        });
        return loadPromise;
    }


    function clipboardLoad() {
        var loadPromise = nodeConnection.domains.clipboard.load();
        loadPromise.fail(function (err) {
            console.error("[brackets-simple-node] failed to run clipboard.load", err);
        });
        loadPromise.done(function (err) {
            //loaded

        });
        return loadPromise;
    }
    //chain(connect, loadClipboard, clipboardLoad);

    function ModalViewModel(){
        this.width = ko.observable(400);
        this.height = ko.observable(200);
        this.theme = ko.observable('0');
        this.grayscale = ko.observable(false);

        this.url = ko.computed(function(){
            var url = 'http://lorempixel.com/' +
                (this.grayscale()? 'g/' : '') +
                this.width() + '/' +
                this.height() + '/' +
                (this.theme() != 0? this.theme() : '');
            return url;
        }, this);

        this.onPreview = _.bind(function(model, event){
            var previewBox = $('.preview-box');

            previewBox.empty();
            previewBox.append('<img src="'+ this.url() +'" />');

            event.stopPropagation();
        }, this);

        this.select = function(model, event){
            $(event.target).select();
            return true;
        }

        this.onUrlCopy = _.bind(function(model, event){
            nodeConnection.domains.clipboard.callCopy(this.url());
        }, this);

        this.onUrlInsert = _.bind(function(model, event){
            var currentDoc = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                pos = editor.getCursorPos(),
                posEnd;

            currentDoc.replaceRange(this.url(), pos);
            posEnd = $.extend({}, pos);
            posEnd.ch += this.url().length;

            editor.focus();
            editor.setSelection(pos, posEnd);
        }, this);

        this.onFileSave = function(){
            fs.showSaveDialog(function(opt, path){
                var data = atob(getBase64Image($('.preview-box > img')[0]));

                fs.saveFile(path, data, { }, function(err, stat, created){
                    debugger;
                });
            });

            event.stopPropagation();
        }
    }

    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to guess the
        // original format, but be aware the using "image/jpg" will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    module.exports = ModalViewModel;
});
