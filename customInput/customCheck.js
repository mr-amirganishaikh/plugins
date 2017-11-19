/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.customCheck = function (options) {
        // Set some default local options
        var localOptions = {
            handle: '',

            customTheme: '',

            checkedClass: 'checked',
            checkedCheckboxClass: '',
            checkedRadioClass: '',

            uncheckedClass: '',
            uncheckedCheckboxClass: '',
            uncheckedRadioClass: '',

            disabledClass: 'disabled',
            disabledCheckboxClass: '',
            disabledRadioClass: '',

            enabledClass: '',
            enabledCheckboxClass: '',
            enabledRadioClass: '',

            hover: true,
            hoverClass: 'hover',

            labelHover: true,
            labelHoverClass: 'hover'
        };

        // merge default and user options
        options = $.extend(localOptions, options);

        // traverse all nodes
        this.each(function () {
            // Variables declaration
            var $this = $(this),
                checkedStatus = $this.prop('checked'),
                disabledStatus = $this.prop('disabled'),
                $customCheck = '.customCheck',
                parentBody = '<div class="customCheck ' + options.customTheme + '" aria-checked="' + checkedStatus + '" aria-disabled="' + disabledStatus + '"></div>',
                customInputHelper = '<ins class="customCheck_helper"></ins>';
            
            // Set off for all events as default
            $($customCheck).off();
            $($customCheck).siblings('label').off();
            
            // Create the customCheck block
            $this.wrap(parentBody);
            $(customInputHelper).insertAfter($this);

            // set display as per customInput
            $($customCheck).css({
                'height': $(this).find('.customCheck_helper').outerHeight(),
                'width': $(this).find('.customCheck_helper').outerWidth()
            });
            
            // To check the status of Input
            var checkStatus = function (target) {
                target.prop("checked", true);
                target.parent($customCheck).attr('aria-checked', 'true').addClass('checked');
                return true;
            }

            // To uncheck the status of Input
            var uncheckStatus = function (target) {
                target.prop("checked", false);
                target.parent($customCheck).attr('aria-checked', 'false').removeClass('checked');
                return true;
            }

            // To toggle the status of Input
            var toggleStatus = function (target, checkedStatus, disabledStatus) {

                if (disabledStatus !== undefined && disabledStatus === false) {
                    if (checkedStatus !== undefined && checkedStatus === true) {
                        uncheckStatus(target);
                    } else if (checkedStatus !== undefined && checkedStatus === false) {
                        checkStatus(target);
                    }
                    return false;
                }
                return false;
            }
            
            
            if (options.hover === true) {
                $($customCheck).on('mouseenter', function () {
                    $(this).addClass(options.hoverClass);
                }).on('mouseleave', function () {
                    $(this).removeClass(options.hoverClass);
                });
            }

            if (options.labelHover === true) {
                $($customCheck).siblings('label').on('mouseenter', function () {
                    $(this).addClass(options.labelHoverClass);
                    $(this).siblings($customCheck).addClass(options.hoverClass);
                }).on('mouseleave', function () {
                    $(this).removeClass(options.labelHoverClass);
                    $(this).siblings($customCheck).removeClass(options.hoverClass);
                });
            }
            
            // main on click event
            $($customCheck).on("click", function () {
                toggleStatus($(this).children('input'), $(this).children('input').prop('checked'), $(this).children('input').prop('disabled'));
            });

            // to keep chaining
            return this;
        });

    };

}(jQuery));
