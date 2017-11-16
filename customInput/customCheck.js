/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.customCheck = function (options) {
        // Set some default local options
        var localOptions = {
            theme: 'customCheck'
        };

        // merge default and user options
        options = $.extend(localOptions, options);

        // traverse all nodes
        this.each(function () {
            var checkStatusTheme = function (checkStatus, disabledStatus) {
                if (checkStatus === true && disabledStatus === false) {
                    return ' checked';
                } else if (checkStatus === false && disabledStatus === true) {
                    return ' disabled';
                } else if (checkStatus === true && disabledStatus === true) {
                    return ' checked disabled';
                }
                return '';
            }
            // express a single node as a jQuery object
            var $this = $(this),
                checkStatus = $this.prop('checked'),
                disabledStatus = $this.prop('disabled'),
                theme = options.theme,
                statusTheme = checkStatusTheme(checkStatus, disabledStatus);

            console.log(options, $this, theme, checkStatus, disabledStatus);

            var parentBody = '<div class="' + theme + statusTheme + '" aria-checked="' + checkStatus + '" aria-disabled="' + disabledStatus + '"></div>';

            $this.wrap(parentBody);

            $this.css({
                'position': 'absolute',
                'top': '-20%',
                'left': '-20%',
                'display': 'block',
                'width': '100%',
                'height': '100%',
                'margin': '0',
                'padding': '0',
                'opacity': '0',
                'border': '0',
                'z-index': '-1'
            });

            // to keep chaining
            return this;
        });

    };

}(jQuery));
