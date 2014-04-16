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

        $("#adbsettings-btn").click(function () {
            $('#moduleModal').modal("hide");

            for (key in self.valueBinding) {
                path = $($(key).attr("for")).html();

                if (fs.lstatSync(path).isFile()) {
                    path = require('path').dirname(path) + "/";
                }
                localStorage.setItem(self.valueBinding[key], path);
            }

            window.document.location.reload();
        });

        for (key in self.valueBinding) {
            var path = localStorage.getItem(self.valueBinding[key]);
            if (path == null) {
                var isWin = /^win/.test(process.platform);
                var platformFix = "win";
                if (!isWin) {
                    platformFix = process.platform.match(".*?darwin.*?") ? "mac" : "linux";
                }
                path = require('path').dirname(process.cwd() + "/buildin-tools/" + platformFix + "/adb") + "/";
            }
            $($(key).attr("for")).html(path);

            $(key).change(function (evt) {
                forsel = $(this).attr("for");
                $(forsel).html($(this).val());
            });
        }
    }
}