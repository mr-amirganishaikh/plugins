(function ($) {

    $.fn.griddish = function (options) {
        // Set some default local options
        var defaults = {
            gridBody: '.griddish_body',
            gridTemplate: '.griddish_template',
            gridDiv: '.griddish_div',
            rowIdPrefix: 'griddish_',
            onInit: function () {}
        };

        // merge default and user options keep defaults unchanged
        var settings = $.extend(true, {}, defaults, options);

        // few default function
        this.newRow = function () {
            var newRow = $(settings.gridDiv).clone();
            return newRow;
        }
        
        // prepare Id format for newly created row
        this.prepareId = function (id) {
            return this.settings.rowIdPrefix + id;
        }
        
        // to get Id of row
        this.getRowId = function (row) {
            return $(row).attr("id");
        }
        
        // set an Id to each row
        this.setRowId = function (row, id) {
            if (id == undefined || id == null || id == 'null' || id == "")
                return false;
            row.attr("id", this.prepareId(id));
        }
        
        // get row with all its details
        this.getRow = function (id) {
            return $(this.settings.gridDiv + this.prepareId(id) + ':first', $(this.settings.gridBody));
        }

        // add row to the grid
        this.addRow = function (row) {
            $(settings.gridBody).append(row);
        }
        
        // add empty row when is required
        this.addEmptyRow = function () {
            var newRow = this.newRow();
            this.addRow(newRow);
        }
        
        settings.onInit(this);

        // to keep chaining
        return this;

    };

}(jQuery));
