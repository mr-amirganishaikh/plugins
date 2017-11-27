/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.inView = function (options) {
        // Set some default local options
        var defaults = {
            parent: window,
            inViewClass: 'inToView',
            outViewClass: 'outFromView',
            onLoad: true,
            onLoadView: function () {},
            whenInView: function () {},
            whenOutView: function () {}
        };

        // merge default and user options keep defaults unchanged
        var settings = $.extend(true, {}, defaults, options);

        // global variables
        var windowH = $(window).height(),
            windowTop = $(window).scrollTop(),
            windowBottom = windowH + windowTop;

        // traverse all nodes
        this.each(function () {
            // express a single node as a jQuery object
            var $this = $(this);

            // individual variables
            var thisH = $this.outerHeight(),
                thisTop = $this.offset().top,
                thisBottom = thisH + thisTop;

            // execute core function on load
            if (settings.onLoad === true) {
                if (thisTop <= windowBottom && thisBottom >= windowTop) {
                    $this.addClass(settings.inViewClass).attr("data-inView", "inView");
                } else {
                    $this.addClass(settings.outViewClass).attr("data-inView", "outView");
                }
            }
            
            // returns inView or outView onLoad
            settings.onLoadView($this, checkView($this)); 

            // execute core function on scroll
            $(window).on("scroll resize", function () {
                windowTop = $(window).scrollTop();
                windowBottom = windowH + windowTop;

                if (thisTop <= windowBottom && thisBottom >= windowTop) {
                    $this.addClass(settings.inViewClass).removeClass(settings.outViewClass).attr("data-inView", "inView");
                    settings.whenInView($this, true);
                } else {
                    $this.addClass(settings.outViewClass).removeClass(settings.inViewClass).attr("data-inView", "outView");
                    settings.whenOutView($this, false);
                }
            });                       
            
            // check if it is in view or out of view
            function checkView(data) {
                if (data.attr("data-inView") == "inView") {
                    return true;
                } else if (data.attr("data-inView") == "outView") {
                    return false;
                }
            };
            // to keep chaining
            return this;
        });

    };

}(jQuery));
