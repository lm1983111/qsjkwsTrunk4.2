var common = function($){
    $(function(){
        $(window).scroll(function(event){
            var scrTop = $(window).scrollTop();
            if(scrTop>=50){
                $('.header').addClass('mini')
            }else{
                $('.header').removeClass('mini')
            }
        });
    })
    return {

    }
}(jQuery)