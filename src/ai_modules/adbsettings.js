/**
 * Created by haku-mac on 14-2-11.
 */
adbsettings = {
    valueBinding: {
        "#adbsettings-adbPath": "adbPath",
        "#adbsettings-aaptPath": "aaptPath"
    },
    init: function () {
        var fs = require('fs');

        var self = this;

        for (key in self.valueBinding) {
            $($(key).attr("for")).html(localStorage.getItem(self.valueBinding[key]));

            $(key).change(function (evt) {
                forsel = $(this).attr("for");
                $(forsel).html($(this).val());
            });
        }

        $("#adbsettings-btn").click(function () {
            $('#moduleModal').modal("hide");

            for (key in self.valueBinding) {
                path = $($(key).attr("for")).html();

                if (fs.lstatSync(path).isFile()) {
                    path = require('path').dirname(path) + "/";
                }
                localStorage.setItem(self.valueBinding[key], path);
            }
        });
    }
}