require.config({
    paths: {
        "jquery": "vendor/jquery-2.1.4.min",
        "gdapi": "core/gdapi",
        "core": "core/core",
        "kvstore": "core/kvstore"
　　}
});

var core;
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
            localStorage.gdriveToken = token;
            
            listFiles(token);
        });

        //
        $("#addKVBtn").on('click', function(){
            var key = $("#keyInput").val();
            var value = $("#valueInput").val();

            var pair = {};
            pair[key] = value;
            core.set(pair);

            displayKVList(core.getKVStorage());
        });

        // 显示第 0,1 步
        $('#headStep').show();
        $('#tokenStep').show();
    });
});

function listFiles(token){
    // 列出所有文件
    core.listFiles(token, function(files){
        $("#fileListStep").show();
        for(var i in files){
            var file = files[i];
            $('#fileListDiv').append('<p><a href="#">' + file.title + '</a></p>');
        }

        // 进入第 2 步，显示键值对输入页面
        showKV();
    });
}

function showKV(){
    $("#kvStep").show();
}

// 显示键值对列表
function displayKVList(pairs){
    for(var key in pairs){
        $('#kvListDiv').append('<p>'+key+' : '+pairs[key]+'</p>');
    }
}
