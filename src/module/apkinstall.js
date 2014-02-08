apkinstall = {
    init: function () {
        $('#apkinstall-btn').click(function () {
            $('#moduleModal').modal("hide");

            localpath = $('#apkinstall-localfile')[0].files[0].path;

            dev_list = MainPage.getSelectDevList();
            if (dev_list.length == 0) {
                alert("Please Select At Least One");
                return;
            }
            for (x in dev_list) {
                MainPage.deviceSimpleCommand(dev_list[x], " install " + localpath, function (hasError, stdout, stderror) {
                    if (stdout.indexOf("Success") > 0) {
                        alert("install to " + dev_list[x] + " Success\n" + stdout);
                    } else {
                        alert("install to " + dev_list[x] + " Error\n" + stdout);
                    }
                });
            }
        });
    }
}