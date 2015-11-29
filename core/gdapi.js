function http(url, headers, method, data, callback){
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

    xhr.open(method, url);
    for(var key in headers){
        xhr.setRequestHeader(key, headers[key]);
    }
    xhr.send();
}

define(function(){
    var listFiles = function(token, callback){
        var url = 'https://www.googleapis.com/drive/v2/files';
        var headers = {
            'Authorization':'Bearer ' + token
        };
        http(url, headers, function(response){
            if( response && response.items ){
                return callback(null, response.items);
            }

            callback(new Error(response));
        });
    }

    return{
        'listFiles': listFiles
    };
});
