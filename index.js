require.config({
    paths: {
        "jquery": "vendor/jquery-2.1.4.min",
        "gdapi": "core/gdapi",
        "core": "core/core",
        "kvstore": "core/kvstore"
　　}
});

// 全局数据
var core, token;

requirejs(["jquery","core"], function($, core) {
    window.core = core;

    $(function(){
        // 如果本地存储里有token，直接填在input里面
        if(localStorage.gdriveToken){
            $("#tokenInput").val(localStorage.gdriveToken);
        }

        // 填写token后，可以点击done进入下一步
        $("#tokenDoneBtn").on('click', function(){
            var token = $("#tokenInput").val();
            window.token = token;
            localStorage.gdriveToken = token;

            listFiles(token);
        });

        $("#addKVBtn").on('click', function(){
            var key = $("#keyInput").val();
            var value = $("#valueInput").val();

            var pair = {};
            pair[key] = value;
            core.set(pair);

            displayKVMemory(core.getKVMemory());
            // 添加一项后，显示同步选项
            $("#syncStep").show();
        });

        $('#syncBtn').on('click', function(){
            core.sync(token, function(err, response){
                if(err) return console.log(err);

                displayKVMemory(core.getKVMemory());

                core.getKVCloud(token, false, function(err, kv){
                    if(err) return console.log(err);

                    displayKVCloud(kv);
                });
            });
        });

        // 显示第 0,1 步
        $('#headStep').show();
        $('#tokenStep').show();
    });
});

function listFiles(token){
    // 列出所有文件
    core.listFiles(token, function(err, files){
        if(err) return console.log(err);

        $("#fileListStep").show();
        for(var i in files){
            var file = files[i];
            $('#fileListDiv').append(
                '<p><img src="' + file.iconLink + '"></img>'
                +'<a href="' + file.webContentLink + '">' + file.title + '</a></p>'
            );
        }

        // 进入第 2 步，显示键值对输入页面
        showKV();
    });

    core.getKVCloud(token, false, function(err, kv){
        if(err) return console.log(err);

        displayKVCloud(kv);
    });
}

function showKV(){
    $("#kvStep").show();
}

// 显示云端键值对数据
function displayKVCloud(pairs){
    if(Object.getOwnPropertyNames(pairs).length == 0)
        return;

    $('#kvCloudDiv').empty();
    
    for(var key in pairs){
        $('#kvCloudDiv').append('<p>'+key+' : '+pairs[key]+'</p>');
    }
}

// 显示内存键值对数据
function displayKVMemory(pairs){
    if(Object.getOwnPropertyNames(pairs).length == 0)
        return;

    $('#kvMemoryDiv').empty();

    for(var key in pairs){
        $('#kvMemoryDiv').append('<p>'+key+' : '+pairs[key]+'</p>');
    }
}
