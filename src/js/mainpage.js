/**
 * Created by haku-mac on 14-2-7.
 */
var MainPage = {
    devStatusMapping: {
        "device": "Normal"
    },
    bindBtns: function () {
        var self = this;

        $('#btn-sync').click(function () {
            MainPage.syncDevList(true);
        });
        // action btn的绑定
        $('.btn-action').click(function () {
            devshell = $(this).attr("devshell");
            module = $(this).attr("module");
            adbshell = $(this).attr("adbshell");

            if (module != null) {
                dev_list = AI.getSelectDevList();
                AI.loadModule(module);
            }

            if (adbshell != null) {
                AndroidDevice.adbSimpleCommand(" " + adbshell);
            }

            if (devshell != null) {
                dev_list = AI.getSelectDevList();
                if (dev_list.length == 0) {
                    alert("Please Select At Least One");
                    return;
                }
                for (x in dev_list) {
                    AI.deviceSimpleCommand(dev_list[x], devshell, function (hasError, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        if (hasError) {
                            throw stderr;
                            return;
                        }
                    });
                }
            }

        });
    },
    syncDevList: function (force) {
        var self = this;
        if (force) {
            // 清空列表
            $('#devlist').html("");
        }

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