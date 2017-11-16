/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.equalHeight = function (options) {
        // Set some default local options
        var localOptions = {
            source: undefined,
            condition: "height"
        };
        
        // merge default and user options
        options = $.extend(localOptions, options);

        // traverse all nodes
        this.each(function () {
            // express a single node as a jQuery object
            var $this = $(this),
                targetH = undefined;
            
            // get the height for the target div
            if (options.condition == 'outerHeight') {
                targetH = $(options.source).outerHeight();
            } else if (options.condition == 'innerHeight') {
                targetH = $(options.source).innerHeight();
            } else if (options.condition == "height") {
                targetH = $(options.source).height();
            }
            
            // set the height for the target div
            $this.css("height", targetH);
            
            // to keep chaining
            return this;
        });

    };

}(jQuery));