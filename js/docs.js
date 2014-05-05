(function($) {

    function resizeSidebar() {
        $('.fn-sidebar.affix').width($('.fn-sidebar.affix').parents('.col-md-3').width());
    }
    
    $(window).resize(resizeSidebar);

    window.sidebar_timeout = window.setInterval(function() {
        var width = $('.fn-sidebar.affix').parents('.col-md-3').width();
        if (width !== null) {
            resizeSidebar();
            clearInterval(window.sidebar_timeout);
        }
    }, 200);

})(jQuery);