/**
 * 键值存储对象
 * @constructor
 * @param {object} options 初始化参数
 * @param {string} options.token 访问google drive所必须的token字符串
 */
var KVStore = function(options){
    this.mem = {};
};

KVStore.prototype.set(pair, callback){
    // 直接把键值对写入内存
    for(var key in pair){
        this.mem[key] = pair[key];
    }
};

KVStore.prototype.get(key, callback){

};

// 本地内存与云端同步
KVStore.prototype.sync(callback){

};
