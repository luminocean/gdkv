// 主要逻辑模块

define(['gdapi','kvstore'], function(gdapi, kvstore){
    var store = new kvstore.KVStore();

    // 获取所有文件
    function listFiles(token, callback){
        gdapi.list(token, function(err, files){
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

    // 本地内存与云端同步
    function sync(token, callback){
        // （将本地存储序列化后传输到云端）
        var data = JSON.stringify(store.storage);
        gdapi.upload(token, {
            metadata:{
                title: 'kvdata'
            },
            data: data
        }, callback);
    }

    return{
        'listFiles': listFiles,
        'set': set,
        'getKVStorage': getKVStorage,
        'sync': sync
    };
});
