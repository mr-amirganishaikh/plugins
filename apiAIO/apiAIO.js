$.prototype.apiAIO = function (config) {
    var defaults = {
        apiUrl: "/",
        spvDebug: true,
        filetypes: "doc|docx|txt|pdf|jpg|jpeg|png|zip",
        preProcessForm: {}
    };

    this.config = $.extend({}, true, defaults, config);
}

// prepareForm
$.prototype.prepareForm = function (form) {
    if (Object.keys(this.config.preProcessForm).length > 0) {
        var preProcessForm = this.config.preProcessForm;
        $.each(preProcessForm, function (i, val) {
            preProcessForm[i](form);
        });
    }
    return form;
}

// convert form to an object
$.prototype.formToObject = function (formArray) {
    //serialize data function
    formArray = this.prepareForm(formArray);
    formArray = formArray.serializeArray();
    var returnArray = {};
    
    for (var i = 0; i < formArray.length; i++) {
        var inputName = formArray[i]['name'];
        returnArray[inputName] = formArray[i]['value'] == "" ? null : formArray[i]['value'];
    }
    
    return returnArray;
}