/* EqualHeight function to set height of two divs on equal basis */
(function ($) {

    $.fn.griddish = function (options) {
        // Set some default local options
        var localOptions = {
            "griddishBody": ".griddish-body",
            "griddishTemplate": ".griddish-template",
            "griddishDiv": ".griddish-div",
            "gridData": undefined,
            "repeat": 1
        };

        // merge default and user options
        options = $.extend(localOptions, options);
        
        // traverse all nodes
        this.each(function () {
            var griddishStructure = $(options.griddishData).html();
            var $griddishStructure = $(griddishStructure);
            
            var newRow = function (){
                var rowTemplateContainer = $(options.griddishTemplate);
                var newRow = $(options.griddishDiv, rowTemplateContainer).clone();			
                return newRow;
            }
            console.log(newRow());
            /*var generateStructure = function(data){
                for(var i = 0; i < data.length; i++){
                    for(var j = 0; j < data[i].length; j++){
                        console.log(data[i].length);
                    }
                }
            }
            
            for (var i = 0; i < options.repeat; i++) {
                $(options.griddishBody).append();
                generateStructure(options.gridData);
            }*/
        });

        // to keep chaining
        return this;

    };

}(jQuery));
