// 主要逻辑模块

define(['gdapi','kvstore'], function(gdapi, kvstore){
    var store = new kvstore.KVStore();

    // 获取所有文件
    function listFiles(token, callback){
        gdapi.listFiles(token, function(err, files){
            if(err) return console.log(err);

            callback(files);
        });
    }

    // 获取内存中的KV键值对
    function getKVStorage(){
        return store.storage;
    }

    // 设置内存中的键值对
    function set(pair, callback){
        store.set(pair, callback);
    }

    return{
        'listFiles': listFiles,
        'set': set,
        'getKVStorage': getKVStorage
    };
});
