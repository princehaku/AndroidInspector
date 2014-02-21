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
                    self.batchC(dev_list[x], localpath, null);
                }
            } else if ($('#apkinstall-url').val() != "") {
                var url_link = $('#apkinstall-url').val();
                var http = require('http');
                var fs = require('fs');

                var date = (new Date()).Format("yyyy-MM-dd_hh-mm-ss");
                var str = date;

                var localpath = process.cwd() + "/cache/" + "ai_" + str + ".apk";
                AI.showProgress("Downloading Files");

                var file = fs.createWriteStream(localpath);

                http.get(url_link,function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        AI.hideProgress();

                        for (x in dev_list) {
                            self.batchC(dev_list[x], localpath, null);
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
        AI.deviceSimpleCommand(dev_id, "uninstall " + packagename, function (hasError, stdout, stderror) {
            console.log("uninstall " + packagename + " done " + stdout);
            if (callback != null) {
                callback(dev_id);
            }
        });
    },
    runPackage: function (dev_id, localpath, pcallback) {
        var package_name = ""
        var intent_name = ""
        var async = require("async");
        async.series([function (callback) {
                ApkInfo.getPackageName(localpath, function (pacname) {
                    package_name = pacname;
                    callback();
                });
            }, function (callback) {
                ApkInfo.getPackageStartIntent(localpath, function (intent) {
                    intent_name = intent;
                    callback();
                });
            }, function (callback) {
                console.info("starting " + package_name + "/" + intent);
                AI.deviceSimpleCommand(dev_id, "shell am start " + package_name + "/" + intent, function (hasError, stdout, stderror) {
                    if (callback != null) {
                        callback(dev_id);
                    }
                });
            }],pcallback);
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
    },
    batchC: function (dev_id, localpath, pcallback) {
        console.info("installing " + localpath);
        var async = require("async");
        var self = this;
        async.series([
            // 是否需要卸载旧版本
            function (callback) {
                if ($('#apkinstall-uninstallold').prop("checked")) {
                    ApkInfo.getPackageName(localpath, function (package_name) {
                        self.uninstall(dev_id, package_name, function () {
                            callback();
                        });
                    });
                } else {
                    callback();
                }
            },
            // 进行安装
            function (callback) {
                self.install(dev_id, localpath, function (devid) {
                    callback();
                });
            },
            // 是否启动
            function (callback) {
                if ($('#apkinstall-runafter').prop("checked")) {
                    self.runPackage(dev_id, localpath);
                }
                callback();
            }],
            pcallback);
    }
}