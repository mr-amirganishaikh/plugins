/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.inView = function (options) {
        // Set some default local options
        var defaults = {
            parent: window,
            inViewClass: 'inToView',
            outViewClass: 'outFromView',
            effect: false,
            effectType: 'inView_fade',
            onLoad: true,
            onLoadView: function () {},
            isInView: function () {}
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
                setView(thisTop, thisBottom, windowTop, windowBottom);
            }
            
            // add effects if it is set to true
            if(settings.effect === true){
                setEffect(settings.effectType);
            }
            
            // returns inView or outView onLoad
            settings.onLoadView($this, checkView($this)); 

            // execute core function on scroll
            $(window).on("scroll resize", function () {
                windowTop = $(window).scrollTop();
                windowBottom = windowH + windowTop;

                setView(thisTop, thisBottom, windowTop, windowBottom);
            });                     
            
            // set effects based on its type
            function setEffect(effectType){
                $this.addClass(effectType);
            }
            
            // condition to set view
            function setView(thisTop, thisBottom, windowTop, windowBottom){                
                if (thisTop <= windowBottom && thisBottom >= windowTop) {
                    // do the changes for in view
                    $this.addClass(settings.inViewClass).removeClass(settings.outViewClass).attr("data-inView", true);
                    
                    // callback to return in view true
                    settings.isInView($this, true);
                } else {
                    // do the changes for out view
                    $this.addClass(settings.outViewClass).removeClass(settings.inViewClass).attr("data-inView", false);
                    
                    // callback to return in view false
                    settings.isInView($this, false);
                }
            }
            
            // check if it is in view or out of view
            function checkView(data) {
                return data.attr("data-inView");
            }
            
            // to keep chaining
            return this;
        });

    };

}(jQuery));
