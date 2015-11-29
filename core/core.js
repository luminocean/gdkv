// 主要逻辑模块

// 云端存储的文件名
var kvFileName = 'kvdata';
var kvCloud; // 云端数据在本地内存的副本

define(['gdapi','kvstore'], function(gdapi, kvstore){
    var store = new kvstore.KVStore();

    // 获取所有文件
    function listFiles(token, callback){
        gdapi.list(token, function(err, files){
            if(err) return callback(err);

            callback(null, files);
        });
    }

    function getKVCloud(token, cached, callback){
        if(cached && kvCloud){
            return callback(null, kvCloud);
        }

        listFiles(token, function(err, files){
            if(err) return callback(err);

            var fileId;
            for(var i in files){
                var file = files[i];

                if(file.title === kvFileName){
                    fileId = file.id;
                    break;
                }
            }

            // 如果找不到存储文件，就返回空
            if(!fileId) return callback(null, null);

            // 定向寻找这个文件
            gdapi.get(token, fileId, function(err, content){
                if(err) return callback(err);
                kvCloud = content;
                callback(null, content);
            });
        });
    }

    // 获取内存中的KV键值对
    function getKVStorage(){
        return store.kvMemory;
    }

    // 设置内存中的键值对
    function set(pair, callback){
        store.set(pair, callback);
    }

    // 本地内存与云端同步
    function sync(token, callback){
        var kvMemory = store.kvMemory;

        // 第一步是将云端数据合并到本地数据中
        getKVCloud(token, true, function(err, kvCloud){
            if(err) return callback(err);

            // 云端有但是本地没有的数据合并到本地来
            // 如果已经有了就忽略云端的
            for(var key in kvCloud){
                if(!key in kvMemory){
                    kvMemory[key] = kvCloud[key];
                }
            }
        });

        // （将本地存储序列化后传输到云端）
        var data = JSON.stringify(kvMemory);
        gdapi.upload(token, {
            metadata:{
                title: kvFileName
            },
            data: data
        }, function(err, response){
            if(err) return callback(err);

            callback(null, response);
        });
    }

    return{
        'listFiles': listFiles,
        'set': set,
        'getKVStorage': getKVStorage,
        'getKVCloud': getKVCloud,
        'sync': sync
    };
});
