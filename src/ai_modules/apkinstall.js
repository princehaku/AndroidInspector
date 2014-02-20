apkinstall = {
    init: function () {
        var self = this;
        // 安装按钮
        $('#apkinstall-btn').click(function () {
            $('#moduleModal').modal("hide");

            dev_list = AI.getSelectDevList();
            if (dev_list.length == 0) {
                alert("Please Select At Least One");
                return;
            }

            var localpath = "";

            if ($('#apkinstall-localfile')[0].files[0] != null) {
                localpath = $('#apkinstall-localfile')[0].files[0].path;

                for (x in dev_list) {
                    function fe(dev_id) {
                        var devid = dev_id;
                        ApkInfo.getPackageName(localpath, function (package_name) {
                            console.info("installing " + package_name);
                            if ($('#apkinstall-uninstallold').prop("checked")) {
                                self.uninstall(devid, package_name, function (dev_id) {
                                    self.install(devid, localpath)
                                });
                            } else {
                                self.install(devid, localpath)
                            }
                        });
                    }

                    fe(dev_list[x]);
                }
            } else if ($('#apkinstall-url').val() != "") {
                url_link = $('#apkinstall-url').val();
                var http = require('http');
                var fs = require('fs');

                var date = (new Date()).Format("yyyy-MM-dd_hh:mm:ss");
                var str = date;

                localpath = process.cwd() + "/cache/" + "ai_" + str + ".apk";
                AI.showProgress("Downloading Files");

                var file = fs.createWriteStream(localpath);

                http.get(url_link,function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        AI.hideProgress();

                        for (x in dev_list) {
                            function fe(dev_id) {
                                var devid = dev_id;
                                ApkInfo.getPackageName(localpath, function (package_name) {
                                    console.info("installing " + package_name);
                                    if ($('#apkinstall-uninstallold').prop("checked")) {
                                        self.uninstall(devid, package_name, function (dev_id) {
                                            self.install(devid, localpath)
                                        });
                                    } else {
                                        self.install(devid, localpath)
                                    }
                                });
                            }

                            fe(dev_list[x]);
                        }
                    });
                }).on('error', function (e) {
                    console.log("Got error: " + e.message);
                    AI.hideProgress();
                    alert("Got Remote File Error: " + e.message);
                });
            }

        });
    },
    /**
     * 卸载某个包
     * @param dev_id
     * @param packagename
     * @param callback dev_id
     */
    uninstall: function (dev_id, packagename, callback) {
        AI.deviceSimpleCommand(dev_id, " uninstall " + packagename, function (hasError, stdout, stderror) {
            console.log("uninstall " + packagename + " done " + stdout);
            if (callback != null) {
                callback(dev_id);
            }
        });
    },

    /**
     * 安装某个包
     * @param dev_id
     * @param path
     * @param callback dev_id
     */
    install: function (dev_id, path, callback) {
        AI.deviceSimpleCommand(dev_id, " install " + path, function (hasError, stdout, stderror) {
            if (stdout.indexOf("Success") > 0) {
                alert("install to " + dev_id + " Success\n" + stdout);
            } else {
                alert("install to " + dev_id + " Error\n" + stdout);
            }
            if (callback != null) {
                callback(dev_id);
            }
        });
    }
}