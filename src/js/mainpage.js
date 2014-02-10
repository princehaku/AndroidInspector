/**
 * Created by haku-mac on 14-2-7.
 */
var MainPage = {
    devStatusMapping: {
        "device": "Normal"
    },
    loadModule: function (module) {
        $('#moduleModal').modal("show");
        $('#moduleContainer').html('');
        url = "module/" + module + ".js";
        $.getScript(url, function () {
            $.ajax({
                url: "module/" + module + ".html",
                success: function (data) {
                    $('#moduleContainer').html(data);
                }
            });
        });
    },
    bindBtns: function () {
        var self = this;

        $('#btn-sync').click(function () {
            MainPage.syncDevList();
        });
        // action btn的绑定
        $('.btn-action').click(function () {
            devshell = $(this).attr("devshell");
            module = $(this).attr("module");
            shell = $(this).attr("shell");

            if (module != null) {
                dev_list = self.getSelectDevList();
                self.loadModule(module);
            }

            if (devshell != null) {
                dev_list = self.getSelectDevList();
                if (dev_list.length == 0) {
                    alert("Please Select At Least One");
                    return;
                }
                for (x in dev_list) {
                    self.deviceSimpleCommand(dev_list[x], devshell, function (hasError, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        if (hasError) {
                            throw stderr;
                            return;
                        }
                    });
                }
            }

            if (shell != null) {
                // 开始vr
                var exec = require('child_process').exec;
                console.info("exec " + shell);
                child = exec(shell,
                    function (error, stdout, stderr) {
                        var hasError = false;
                        if (stderr != "") {
                            hasError = true;
                            console.error('stderr: ' + stderr);
                        }
                        if (error !== null) {
                            hasError = true;
                            console.error('exec error: ' + error);
                            stderr = error;
                        }

                    });

                child.unref();
            }

        });
    },
    showtips: function (type, text) {

    },
    getSelectDevList: function () {
        devlist = [];
        $(".devid:checked").each(function () {
            if ($(this).attr("devid") != null) {
                devlist.push($(this).attr("devid"))
            }
        });
        return devlist;
    },
    deviceSimpleCommand: function (dev_id, args, callback) {

        // 开始动画
        var doingbtn = $("tr[devid='" + dev_id + "']").find(".btn-doing");
        doingbtn.removeClass("hide");

        AndroidDevice.adbDeviceSimpleCommand(dev_id, args, function (hasError, stdout, stderr) {
            // 结束动画
            doingbtn.addClass("hide");
            callback(hasError, stdout, stderr);
        });

    },
    syncDevList: function () {
        var self = this;
        // 清空列表
        $('#devlist').html("");

        AndroidDevice.fetchDevLists(function (devLists) {
            for (x in devLists) {
                dev = devLists[x];
                var devCol = $('.dev_template_original').clone();
                devCol.attr('devid', dev[0]);
                devCol.find('.devname').html(dev[0]);
                devCol.attr("class", "");
                devCol.find('.btn-status').css('color', "green");
                // 不正常的设备标红 正常的打上devid
                if (dev[1] != "device") {
                    devCol.find('.btn-status').css('color', "red");
                } else {
                    devCol.find('.devid').attr('devid', dev[0]);
                }
                if (self.devStatusMapping.hasOwnProperty(dev[1])) {
                    dev[1] = self.devStatusMapping[dev[1]];
                }
                devCol.find('.btn-status').tooltip({
                    title: dev[1]
                });
                devCol.show();
                $('#devlist').append(devCol);
            }
        });
    }
}