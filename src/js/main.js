var version_date="20171121";
var ROOT_PATH="http://system.kf.chinasunhospital.com/";
require.config({
    urlArgs: "v="+version_date,
    baseUrl:"src/js",
    waitSeconds: 0,//waitSeconds 加载超时时间
    paths: {
        'underscore': 'lib/underscore-min',
        "jquery" : "lib/jquery.min",
        "bootstrap" : "lib/bootstrap.min",
        "moment" : "lib/moment.min",
        "swiper" : "lib/swiper.jquery.min",
        "q" : "lib/q",
    },
    shim : {
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







