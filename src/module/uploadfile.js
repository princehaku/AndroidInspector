/**
 * Created by haku-mac on 14-2-10.
 */
uploadfile = {
    init: function () {
        $('#uploadfile-btn').click(function () {
            $('#moduleModal').modal("hide");

            dev_list = MainPage.getSelectDevList();
            if (dev_list.length == 0) {
                alert("Please Select At Least One");
                return;
            }

            var localpath = "";

            if ($('#uploadfile-localfile')[0].files[0] != null) {
                localpath = $('#uploadfile-localfile')[0].files[0].path;
                remotepath = $('#uploadfile-remote').val();

                for (x in dev_list) {
                    dev_id = dev_list[x];

                    MainPage.deviceSimpleCommand(dev_id, " push \"" + localpath + "\" \"" + remotepath + "\"", function (hasError, stdout, stderror) {
                        if (stderror != null && stderror.toString().indexOf("failed") > 0) {
                            alert(stderror);
                        } else {
                            console.log("push " + dev_id + " done " + stderror);
                        }
                    });
                }

            }

        });
    }
}