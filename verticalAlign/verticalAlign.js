/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.verticalAlign = function (options) {
        // Set some default local options
        var localOptions = {
            align: "middle",
            parent: this.parent(),
            parentHType: "outerHeight",
            targetHType: "outerHeight"
        };

        // merge default and user options
        options = $.extend(localOptions, options);

        // traverse all nodes
        this.each(function () {
            // express a single node as a jQuery object
            var $this = $(this),
                $parent = $(options.parent),
                parentH = undefined,
                thisH = undefined,
                gap = undefined;

            // get the height of parent div
            if (options.parentHType == "height") {
                parentH = $parent.height();
            } else if (options.parentHType == "innerHeight") {
                parentH = $parent.innerHeight();
            } else {
                parentH = $parent.outerHeight();
            }

            // get the height of target div
            if (options.targetHType == "height") {
                thisH = $this.height();
            } else if (options.targetHType == "innerHeight") {
                thisH = $this.innerHeight();
            } else {
                thisH = $this.outerHeight();
            }

            // get and set the gap
            if (options.align == "bottom") {
                gap = parentH - thisH;
                $this.css({
                    "margin-top": gap
                });
            } else {
                gap = (parentH - thisH) / 2;
                $this.css({
                    "margin-top": gap,
                    "margin-bottom": gap
                });
            }

            // to keep chaining
            return this;
        });

    };

}(jQuery));
