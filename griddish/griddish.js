/*Griddish Library */
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
        addNewBtn: undefined,

        editable: true,
        resettable: true,
        deletable: true,
        undeletable: true,
        confirmBeforeDelet: true,
        removeRowOnDelete: true,

        showOnEdit: ".onEdit",
        showOnView: ".onView",
        onDeleteClass: "griddishDeleted",
        onEditClass: "griddishEditing",
        onSaveClass: "griddishSaved",
        onEmptyClass: "griddishEmpty",

        onInit: function () {},
        onEdit: function () {},
        onReset: function () {},
        onDelete: function (row) {},
        beforeSave: function (row) {
            return true;
        },
        onChange: function () {},
        onSave: function () {},
        onAdd: function () {}
    };

    this.options = $.extend({}, true, defaults, customs);

    /****** Some Basic functions used to create a row ******/
    /* Create a new row Function */
    this.newRow = function () {
        var tempContainer = $(this.options.gridTemplate, this);
        var newRow = $(this.options.gridDiv, tempContainer).clone();
        return newRow;
    }

    /* Set Row ID */
    this.setRowId = function (row, id) {
        if (id == undefined || id == null || id == 'null' || id == "")
            return false;
        row.attr("id", this.prepareId(id));
    }    

    /* Create a format for Id */
    this.prepareId = function (id) {
        return this.options.rowIdPrefix + id;
    }
    
    /* Get Row ID */
    this.getRowId = function (row) {
        return $(row).attr("id");
    }

    /* Main function to add a row */
    this.addRow = function (row) {
        $(this.options.gridBody).append(row);
        if (this.options.editable) {
            this.makeEditable(row);
        }
        if (this.options.deletable) {
            this.makeDeletable(row);
        }
        if (this.options.undeletable) {
            this.makeUndeletable(row);
        }

        this.options.onAdd(row);
        this.options.onChange(this);
    }

    /* Create an empty row */
    this.addEmptyRow = function () {
        var newRow = this.newRow();
        newRow.addClass(this.options.onEmptyClass);
        this.addRow(newRow);

        if (this.options.editable) {
            this.makeEditable(row);
        }
    }
    
    /* Get row */
	this.getRow	= function(id){		
		return $(this.options.griddishRow+this.prepareId(id)+':first',$(this.options.griddishRows,this));
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

    this.deleteRow = function (row) {
        var instance = this;
        row.removeClass(this.options.onUndeleteClass);
        row.addClass(this.options.onDeleteClass);

        $(this.options.showOnUnDelete, row).hide();
        $(this.options.showOnEdit, row).hide();

        $(this.options.showOnView, row).fadeIn();
        $(this.options.showOnDelete, row).fadeIn();

        if (this.options.removeRowOnDelete) {
            row.fadeOut(function () {
                this.remove();
                instance.options.onDelete(row);
                instance.options.onChange(instance);
            });
        } else {
            this.options.onDelete(row);
            this.options.onChange(this);
        }


    }

    this.deleteParentRow = function (elem) {
        this.deleteRow($(elem).closest(this.options.griddishRow));
    }

    this.isDeleted = function (row) {
        if (row.hasClass(this.options.onDeleteClass)) {
            return true;
        } else {
            return false
        }
    }

    this.undeleteRow = function (row) {

        row.removeClass(this.options.onDeleteClass);
        row.addClass(this.options.onUndeleteClass);
        $(this.options.showOnDelete, row).hide();
        $(this.options.showOnUnDelete, row).fadeIn();

        this.options.onUnDelete(row);
        this.options.onChange(this);
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

    this.makeDeletable = function (row) {
        var instance = this;
        $(this.options.deleteBtn, row).click(function (e) {
            if (instance.options.confirmBeforeDelete) {
                if (instance.options.beforeDelete(row, this) == true) {
                    instance.deleteRow(row);
                }
            } else {
                instance.deleteRow(row);
            }

        }).show();


    }

    this.makeUndeletable = function (row) {
        var instance = this;
        $(this.options.undeleteBtn, row).click(function (elem) {
            instance.undeleteRow(row);
        });
        if (this.isDeleted(row)) {
            $(this.options.undeleteBtn, row).show();
        } else {
            $(this.options.undeleteBtn, row).hide();
        }
    }

    // Event to be triggered on AddNew Btn
    var instance = this;
    if (this.options.addNewBtn != undefined) {
        $(this.options.addNewBtn, instance).click(function () {
            instance.addEmptyRow();
        })
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
