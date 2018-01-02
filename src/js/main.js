var version_date="20171121055";
//var ROOT_PATH="http://system.kf.chinasunhospital.com/";
var ROOT_PATH="http://192.168.3.9:8081/";
require.config({
    urlArgs: "v="+version_date,
    baseUrl:"src/js",
    waitSeconds: 0,//waitSeconds 加载超时时间
    paths: {
        'underscore': 'lib/underscore-min',
        "jquery" : "lib/jquery.min",
        "bootstrap" : "lib/bootstrap.min",
        //"swiper" : "lib/swiper.min",
        "swiper" : "lib/idangerous.swiper.min",
        "q" : "lib/q",

        "common":"chnsun/common",
    },
    shim : {
        common:{
            deps : ['jquery'],
        },
        underscore:{
            exports : '_'
        },
        swiper:{
            deps : [ 'jquery' ],
            exports : 'swiper'
        },
        bootstrap : {
            deps : [ 'jquery' ],
            exports : 'bootstrap'
        } ,
        q:{
            exports : 'Q'
        },
    }
});







