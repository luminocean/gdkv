// 提供键值存储功能的模块

define(function(){
    var KVStore = function(){
        this.kvMemory = {};
    };

    KVStore.prototype.set = function(pair, callback){
        for(var key in pair){
            this.kvMemory[key] = pair[key];
        }
    };

    return{
        'KVStore': KVStore
    };
});
