define(['gdapi'], function(gdapi){
    function listFiles(token, callback){
        gdapi.listFiles(token, function(err, files){
            if(err) return console.log(err);

            callback(files);
        });
    }

    return{
        'listFiles': listFiles
    };
});
