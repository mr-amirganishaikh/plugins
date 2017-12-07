<!doctype html>
<html>

<head>
    <title>Insert Test Code</title>
    <link href="../common-files/common.css" type="text/css" rel="stylesheet" />
    <link href="../griddish/helper.css" type="text/css" rel="stylesheet" />
    <style>
        .griddish_template {
            display: none;
        }

        .onEdit {
            display: none;
        }

        .editBtn,
        .saveBtn,
        .deleteBtn,
        .cancelEditBtn {
            cursor: pointer;
        }

        input {
            height: 30px;
            margin-bottom: 10px;
            padding: 5px;
            width: 100%;
        }

    </style>
</head>

<body>
    <div class="container">
        <h2>Fill in the form to add information</h2>
        <hr/>
    </div>
    <div class="container p-x">
        <form id="insertForm">
            <div class="input-group">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" />
            </div>
            <div class="input-group">
                <label for="emailId">Email Id</label>
                <input type="email" name="emailId" id="emailId" />
            </div>
            <div class="input-group">
                <label for="phone">Phone</label>
                <input type="tel" name="phone" id="phone" />
            </div>
            <div class="input-group">
                <label for="address">Address</label>
                <input type="text" name="address" id="address" />
            </div>
        </form>
        <div class="btn-row">
            <button type="button" id="save">Save</button>
        </div>
    </div>
    <script src="../common-files/jquery.min.js"></script>
    <!--<script src="../apiAIO/apiAIO.js" type="text/javascript"></script>-->
    <script>
        var preProcessForm = {};

        var prepareForm = function(form) {
            var preProcessForm = preProcessForm;
            $.each(preProcessForm, function(i, val) {
                preProcessForm[i](form);
            });
            return form;
        }

        var formToObject = function(formArray) {
            formArray = this.prepareForm(formArray);
            formArray = formArray.serializeArray();
            
            var returnArray = {};

            for (var i = 0; i < formArray.length; i++) {
                var inputName = formArray[i]['name'];
                returnArray[inputName] = formArray[i]['value'] == "" ? null : formArray[i]['value'];
            }

            return returnArray;
        }

    </script>

    <script>
        $(document).ready(function() {
            $("#save").on("click", function() {
                var formObject = $("#insertForm").serialize();
                var config = {
                    type: "POST",
                    url: "ws/insertEntry.php",
                    data: formObject,
                    success: function(data, status, xhr){
                        console.log("data S", data);
                        console.log("status S", status);
                        console.log("xhr S", xhr);
                    },
                    error: function(xhr, status, data){
                        console.log("data E", data);
                        console.log("status E", status);
                        console.log("xhr E", xhr);
                    }
                };
                $.ajax(config);
            });
        });

    </script>
</body>

</html>
