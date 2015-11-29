// 提供访问google drive的API
define(function(){
    // 获取所有文件列表
    var list = function(token, callback){
        http(token, function(err, response){
            if(err) return callback(err);

            if( response && response.items ){
                return callback(null, response.items);
            }

            callback(new Error(response));
        });
    }

    // 上传文件
    var upload = function(token, file, callback){
        http(token, 'post', file, function(err, response){
            if(err) return callback(err);

            if( response && response.items ){
                return callback(null, response.items);
            }
            if( response ){
                return callback(null, response);
            }
            callback(new Error(response));
        });
    };

    // 更新指定文件
    var update = function(token, file, callback){
        if(!file.id) return callback(new Error('更新文件时找不到fileId'));

        http(token, 'put', file, method2url['put']+'/'+file.id, function(err, response){
            if(err) return callback(err);

            if( response && response.items ){
                return callback(null, response.items);
            }
            if( response ){
                return callback(null, response);
            }
            callback(new Error(response));
        });
    };

    // 获取指定文件名的文件
    var get = function(token, fileId, callback){
        http(token, 'get', null,
            method2url['get']+'/'+fileId+'?alt=media', function(err, response){
            if(err) return callback(err);

            callback(null, response);
        });
    };

    return{
        'list': list,
        'get': get,
        'upload': upload,
        'update': update
    };
});

// HTTP方法与对应URL的映射
var method2url = {
    'get': 'https://www.googleapis.com/drive/v2/files',
    'post': 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart',
    'put': 'https://www.googleapis.com/upload/drive/v2/files'
};

// HTTP执行方法
function http(token, method, option, url, callback){
    // 允许中间参数method, data没写的时候callback也可以直接写在最后
    var argLen = arguments.length;
    if(argLen < 5 && typeof(arguments[argLen-1]) == 'function'){
        callback = arguments[argLen-1];
        arguments[argLen-1] = undefined;
    }
    method = method || 'get';

    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(this.readyState !== 4 || this.status !== 200 )
            return callback(new Error('weird ready state:' + this.responseText));

        callback(null, JSON.parse(this.responseText));
    };

    xhr.open(method, url || method2url[method]); // ajax目标url
    xhr.setRequestHeader('Authorization', 'Bearer ' + token); // 认证字段

    // 要传送的请求内容
    var content = undefined;

    // post请求的话，要进行内容拆分
    if(method == 'post'){
        var metadata = option.metadata;
        var data = option.data;
        var boundary = "abrownquickfoxjumpsoveralazydog";

        xhr.setRequestHeader('Content-type', 'multipart/related; boundary='+boundary);
        content = buildMultipartContent(metadata, data, boundary);
    }
    // 如果是put，简单更新云端文件即可，不需要元数据了，因此不必进行拆分
    else if(method == 'put'){
        xhr.setRequestHeader('Content-type', 'application/json');
        content = option.data;
    }

    xhr.send(content);
}

// 将要传送的文件转化成能放在multipart的post请求里面的字符串
// content = {
//   metadata:{
//     title: xxx
//   },
//   data: yyy
// }
function buildMultipartContent(metadata, data, boundary){
    var parts = [];
	parts.push('--' + boundary);
	parts.push('Content-Type: application/json; charset=UTF-8');
	parts.push('');
	parts.push(JSON.stringify(metadata));
	parts.push('--' + boundary);
	parts.push('Content-Type: application/json; charset=UTF-8');
	parts.push('');
	parts.push(data);
	parts.push('--' + boundary + '--');

    return parts.join('\r\n');
}
