/* Griddish Library */
$.prototype.griddish = function (customs) {
    var defaults = {
        gridDiv: ".griddish_div",
        gridBody: ".griddish_body",
        gridTemplate: ".griddish_template",

        rowIdPrefix: "griddishDiv_",

        editBtn: ".editBtn",
        deleteBtn: ".deleteBtn",
        saveBtn: ".saveBtn",
        cancelEditBtn: ".cancelEditBtn",

        editable: true,
        resettable: true,
        deletable: true,
        confirmBeforeDelete: true,

        showOnEdit: ".onEdit",
        showOnView: ".onView",
        onDeleteClass: "griddishDeleted",
        onEditClass: "griddishEditing",
        onSaveClass: "griddishSaved",
        onEmptyClass: "griddishEmpty",

        onInit: function () {},
        onEdit: function () {},
        onReset: function () {},
        beforeSave: function (row) {
            return true;
        },
        onChange: function () {},
        onSave: function () {},
        onAdd: function () {}
    };

    this.options = $.extend({}, true, defaults, customs);

    this.newRow = function () {
        var tempContainer = $(this.options.gridTemplate, this);
        var newRow = $(this.options.gridDiv, tempContainer).clone();
        return newRow;
    }

    this.setRowId = function (row, id) {
        if (id == undefined || id == null || id == 'null' || id == "")
            return false;
        row.attr("id", this.prepareId(id));
    }

    this.getRowId = function (row) {
        return $(row).attr("id");
    }

    this.prepareId = function (id) {
        return this.options.rowIdPrefix + id;
    }

    this.getRow = function (id) {
        return $(this.options.gridDiv + this.prepareId(id) + ':first', $(this.options.gridBody));
    }

    this.addRow = function (row) {
        $(this.options.gridBody).append(row);
        if (this.options.editable) {
            this.makeEditable(row);
        }
    }

    this.addEmptyRow = function () {
        var newRow = this.newRow();
        this.addRow(newRow);
    }


    this.editRow = function (row) {
        $(this.options.showOnView, row).hide();
        $(this.options.showOnEdit, row).fadeIn();

        row.removeClass(this.options.onSaveClass).addClass(this.options.onEditClass);

        this.options.onEdit(row);
    }

    this.isEditing = function (row) {
        if (row.hasClass(this.options.onEditClass)) {
            return true;
        } else {
            return false;
        }
    }

    this.cancelEditRow = function (row) {

        if (row.hasClass(this.options.onEditClass)) {
            $(this.options.showOnEdit, row).hide();
            $(this.options.showOnView, row).fadeIn();
            row.addClass(this.options.onSaveClass).removeClass(this.options.onEditClass).removeClass(this.options.onEmptyClass);

            this.options.onReset(row);
            this.options.onChange(this);
        }
        return true;
    }

    this.saveRow = function (row) {
        if (this.options.beforeSave(row)) {
            $(this.options.showOnEdit, row).hide();
            $(this.options.showOnView, row).fadeIn();
            row.addClass(this.options.onSaveClass).removeClass(this.options.onEditClass).removeClass(this.options.onEmptyClass);

            this.options.onSave(row);
            this.options.onChange(this);
        } else {
            console.warn("Griddish: Save row aborted as beforeSave returned false");
            return false;
        }

    }

    this.makeEditable = function (row) {
        var instance = this;
        $(this.options.editBtn, row).click(function (elem) {
            instance.editRow(row);
        });
        $(this.options.saveBtn, row).click(function (elem) {
            instance.saveRow(row);
        });

        if (this.isEditing(row)) {
            $(this.options.editBtn, row).hide();
            $(this.options.saveBtn, row).show();
        } else {
            $(this.options.editBtn, row).show();
            $(this.options.saveBtn, row).hide();
        }


        if (this.options.resettable) {
            $(this.options.cancelEditBtn, row).click(function (elem) {
                instance.cancelEditRow(row);
            });

            if (this.isEditing(row)) {
                $(this.options.cancelEditBtn, row).show();
            } else {
                $(this.options.cancelEditBtn, row).hide();
            }
        }
    }


    // init function
    this.options.onInit(this);

    return this;
}

// settext helper
$.prototype.setText = function (tagSelect, val) {
    $('[data-gridData="' + tagSelect + '"]', this).html(val);
}

// gettext helper
$.prototype.getText = function (tagSelect) {
    return $('[data-gridData="' + tagSelect + '"]', this).text();
}

// setInputVal helper
$.prototype.setInputVal = function (tagselect, val) {
    $('[data-gridValue="' + tagselect + '"]', this).val(val);
}

// getInputVal helper
$.prototype.getVal = function (tagselect) {
    return $('[data-gridValue="' + tagselect + '"]', this).val();
}
