// 主要逻辑模块

// 云端存储的文件名
var kvFileName = 'kvdata';
var kvCloud, kvCloudFileId; // 云端数据在本地内存的副本信息

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
        // 如果选择使用缓存，那么有的话自动返回
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
            kvCloudFileId = fileId;

            // 定向寻找这个文件
            gdapi.get(token, fileId, function(err, content){
                if(err) return callback(err);
                kvCloud = content;
                callback(null, content);
            });
        });
    }

    // 获取内存中的KV键值对
    function getKVMemory(){
        return store.kvMemory;
    }

    // 设置内存中的键值对
    function set(pair, callback){
        store.set(pair, callback);
    }

    // 本地内存与云端同步
    function sync(token, callback){
        var kvMemory = store.kvMemory;
        var action = 'update'; // 默认是进行更新操作（使用PUT）

        // 第一步是将云端数据合并到本地数据中
        getKVCloud(token, true, function(err, kvCloud){
            if(err) return callback(err);

            if(kvCloud){
                // 云端有但是本地没有的数据合并到本地来
                // 如果已经有了就忽略云端的
                for(var key in kvCloud){
                    if(!kvMemory[key]){
                        kvMemory[key] = kvCloud[key];
                    }
                }
            }else{
                // 如果云端没有数据，那么接下来的操作需要改为post
                action = 'upload';
            }

            // 上传本地键值对数据到云端
            var data = JSON.stringify(kvMemory);

            if(action == 'upload'){
                gdapi.upload(token, {
                    metadata:{
                        title: kvFileName
                    },
                    data: data
                }, finish);
            }else if(action == 'update'){
                gdapi.update(token, {
                    id: kvCloudFileId,
                    metadata:{},
                    data: data
                }, finish);
            }

            function finish(err, response){
                if(err) return callback(err);
                callback(null, response);
            }
        });
    }

    return{
        'listFiles': listFiles,
        'set': set,
        'getKVMemory': getKVMemory,
        'getKVCloud': getKVCloud,
        'sync': sync
    };
});
