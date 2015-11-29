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
        if(localStorage.gdriveToken){
            $("#tokenInput").val(localStorage.gdriveToken);
        }

        $("#tokenDoneBtn").on('click', function(){
            var token = $("#tokenInput").val();
            tokenDone(token);
        });
    });
});

// 获取token后进行的动作
function tokenDone(token){
    core.listFiles(token, function(files){
        console.log(files);

        for(var i in files){
            var file = files[i];
            $('#fileListDiv').append('<p><a href="#">' + file.title + '</a></p>');
        }
    });
}
