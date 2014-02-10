apkinstall = {
    init: function () {
        var self = this;
        $('#apkinstall-btn').click(function () {
            $('#moduleModal').modal("hide");

            dev_list = MainPage.getSelectDevList();
            if (dev_list.length == 0) {
                alert("Please Select At Least One");
                return;
            }

            var localpath = "";

            if ($('#apkinstall-localfile')[0].files[0] != null) {
                localpath = $('#apkinstall-localfile')[0].files[0].path;

                for (x in dev_list) {
                    ApkInfo.getPackageName(localpath, function (package_name) {
                        console.info("installing " + package_name);
                        if ($('#apkinstall-uninstallold').prop("checked")) {
                            self.uninstall(dev_list[x], package_name, function () {
                                self.install(dev_list[x], localpath)
                            });
                        } else {
                            self.install(dev_list[x], localpath)
                        }
                    });
                }
            } else if ($('#apkinstall-url').val() != "") {
                url_link = $('#apkinstall-url').val();
                var http = require('http');
                var fs = require('fs');

                localpath = "./ai.apk";
                MainPage.showProgress("Downloading Files");

                var file = fs.createWriteStream(localpath);
                http.get(url_link, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        MainPage.hideProgress();

                        for (x in dev_list) {
                            ApkInfo.getPackageName(localpath, function (package_name) {
                                console.info("installing " + package_name);
                                if ($('#apkinstall-uninstallold').prop("checked")) {
                                    self.uninstall(dev_list[x], package_name, function () {
                                        self.install(dev_list[x], localpath)
                                    });
                                } else {
                                    self.install(dev_list[x], localpath)
                                }
                            });
                        }
                    });
                }).on('error', function(e) {
                    console.log("Got error: " + e.message);
                    MainPage.hideProgress();
                    alert("Got Remote File Error: " +e.message);
                });
            }

        });
    },
    /**
     * 安装某个包
     * @param dev_id
     * @param path
     * @param callback args
     */
    uninstall: function (dev_id, packagename, callback) {
        MainPage.deviceSimpleCommand(dev_id, " uninstall " + packagename, function (hasError, stdout, stderror) {
            console.log("uninstall " + packagename + " done " + stdout);
            if (callback != null) {
                callback();
            }
        });
    },

    /**
     * 安装某个包
     * @param dev_id
     * @param path
     * @param callback args
     */
    install: function (dev_id, path, callback) {
        MainPage.deviceSimpleCommand(dev_id, " install " + path, function (hasError, stdout, stderror) {
            if (stdout.indexOf("Success") > 0) {
                alert("install to " + dev_id + " Success\n" + stdout);
            } else {
                alert("install to " + dev_id + " Error\n" + stdout);
            }
            if (callback != null) {
                callback();
            }
        });
    }
}