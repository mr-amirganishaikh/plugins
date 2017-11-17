/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.customCheck = function (options) {
        // Set some default local options
        var localOptions = {
            handle: '',
            
            checkboxTheme: 'customCheck',
            radioTheme: 'customRadio',
            
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
            
            hoverClass: 'hover',
            focusClass: 'focus',
            activeClass: 'active',
            
            labelHover: 'true',
            labelHoverClass: 'hover',
            
            
        };

        // merge default and user options
        options = $.extend(localOptions, options);

        // traverse all nodes
        this.each(function () {
            // To check default status of input
            var checkStatusTheme = function (checkedStatus, disabledStatus) {
                if (checkedStatus === true && disabledStatus === false) {
                    return ' checked';
                } else if (checkedStatus === false && disabledStatus === true) {
                    return ' disabled';
                } else if (checkedStatus === true && disabledStatus === true) {
                    return ' checked disabled';
                }
                return '';
            }
            
            // To check default status of input
            var checkInputTheme = function (targetType) {
                console.log(targetType);
                if(targetType !== undefined && targetType === 'checkbox'){
                    return options.checkboxTheme;
                }else if(targetType !== undefined && targetType === 'radio'){
                    return options.radioTheme;
                }
                
            }

            // Variables declaration
            var $this = $(this),
                checkedStatus = $this.prop('checked'),
                disabledStatus = $this.prop('disabled'),
                theme = checkInputTheme($this.attr('type')),
                $theme = '.' + theme,
                statusTheme = checkStatusTheme(checkedStatus, disabledStatus),
                parentBody = '<div class="' + theme + statusTheme + '" aria-checked="' + checkedStatus + '" aria-disabled="' + disabledStatus + '"></div>';

            $($theme).off();
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

            // To check the status of Input
            var checkStatus = function (target) {
                target.prop("checked", true);
                target.parent($theme).attr('aria-checked', 'true').addClass('checked');
                return true;
            }

            // To uncheck the status of Input
            var uncheckStatus = function (target) {
                target.prop("checked", false);
                target.parent($theme).attr('aria-checked', 'false').removeClass('checked');
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

            $($theme).on("click", function () {
                toggleStatus($(this).children('input'), $(this).children('input').prop('checked'), $(this).children('input').prop('disabled'));
            });
            
            $($theme).on('hover', function (){
                $(this).addClass(options.hoverClass);
            });

            // to keep chaining
            return this;
        });

    };

}(jQuery));
