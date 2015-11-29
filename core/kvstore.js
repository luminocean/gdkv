// 提供键值存储功能的模块

define(function(){
    var KVStore = function(){
        this.storage = {};
    };

    KVStore.prototype.set = function(pair, callback){
        for(var key in pair){
            this.storage[key] = pair[key];
        }
    };

    return{
        'KVStore': KVStore
    };
});
