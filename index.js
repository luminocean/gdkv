require.config({
    paths: {
        "jquery": "vendor/jquery-2.1.4.min",
        "gdapi": "core/gdapi",
        "core": "core/core"
　　}
});

var core;
requirejs(["jquery","core"], function($, core) {
    window.core = core;

    $(function(){
        // 显示第 0,1 步
        $('#headStep').show();
        $('#tokenStep').show();

        // 如果本地存储里有token，直接填在input里面
        if(localStorage.gdriveToken){
            $("#tokenInput").val(localStorage.gdriveToken);
        }

        // 填写token后，点击done进入下一步
        $("#tokenDoneBtn").on('click', function(){
            var token = $("#tokenInput").val();
            listFiles(token);
        });
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
