// 提供访问google drive的API
define(function(){
    // 获取所有文件列表
    var list = function(token, callback){
        var headers = {
            'Authorization':'Bearer ' + token
        };
        http(headers, function(response){
            if( response && response.items ){
                return callback(null, response.items);
            }

            callback(new Error(response));
        });
    }

    // 上传文件
    var upload = function(token, file, callback){
        var headers = {
            'Authorization':'Bearer ' + token
        };
        http(headers, 'post', file, function(response){
            if( response && response.items ){
                return callback(null, response.items);
            }
            if( response ){
                return callback(null, response);
            }
            callback(new Error(response));
        });
    };

    return{
        'list': list,
        'upload': upload
    };
});

// HTTP方法与对应URL的映射
var method2url = {
    'get': 'https://www.googleapis.com/drive/v2/files',
    'post': 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart'
};

// HTTP执行方法
function http(headers, method, file, callback){
    // 允许中间参数method, data没写的时候callback也可以直接写在最后
    var argLen = arguments.length;
    if(argLen < 4 && typeof(arguments[argLen-1]) == 'function'){
        callback = arguments[argLen-1];
        arguments[argLen-1] = undefined;
    }
    method = method || 'get';

    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(this.readyState !== 4 || this.status !== 200 )
            return console.log('weird ready state:', this.responseText);

        callback(JSON.parse(this.responseText));
    };

    var url = method2url[method];
    xhr.open(method, url);

    for(var key in headers){
        xhr.setRequestHeader(key, headers[key]);
    }
    // 要传送的请求内容，get请求为空，post请求有内容要单独处理
    var content = undefined;

    // post请求的话，要进行内容拆分
    if(method == 'post'){
        var metadata = file.metadata;
        var data = file.data;
        var boundary = "abrownquickfoxjumpsoveralazydog";

        xhr.setRequestHeader('Content-type', 'multipart/related; boundary='+boundary);
        content = buildMultipartContent(metadata, data, boundary);
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
