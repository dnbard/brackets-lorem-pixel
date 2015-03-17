define(function(require, exports){
    var storage,
        _ = brackets.getModule('thirdparty/lodash'),
        storageKey = 'ext_injectcss';

    function init(){
        storage = localStorage.getItem(storageKey) || {};
    }

    function add(id, data){
        storage[id] = data;
        save();
    }

    function remove(id){
        delete storage[id];
        save();
    }

    function save(){
        localStorage.setItem(storageKey, storage);
    }

    function get(id){
        return storage[id];
    }

    function toArray(){
        return _.toArray(storage);
    }

    init();

    exports.add = add;
    exports.modify = add;
    exports.remove = remove;
    exports.save = save;
});
