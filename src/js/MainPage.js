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
                AI.adbSimpleCommand({shell: " " + adbshell, tips: "ADB Doing"}, null);
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
                            AI.showError(stderr);
                            return;
                        }
                    });
                }
            }

        });

        // tab上btn的绑定
        this.bindDevTabsClick();
    },
    bindDeviceCol: function (devCol) {
        var self = this;
        // 右边的选项按钮
        devCol.find(".btn-opitions").click(function (e) {
            e.stopPropagation();
            var obj = $(this).parent().parent().parent();
            var dev_id = obj.attr('devid');
            $('#singledevid').val(obj.attr('devid'));
            AI.loadModule("devicesetting");
        });
        // 整个条
        devCol.click(function () {
            var obj = $(this);
            // 高亮自己 排除其他
            $('tr').each(function () {
                var tr = $(this);
                tr.removeClass("active");
            });
            obj.addClass("active");

            if (obj.find('.devid').attr('devid') != null) {
                var dev_id = obj.attr('devid');
                $('#singledevid').val(obj.attr('devid'));
                var tab_name = $('#deviceTab li[class=active] a').attr('href').replace("#", "");
                var target_tab = $('#' + tab_name);
                self.tabClick(tab_name, dev_id, target_tab);
            }
        });
    },
    tabClick: function (tab_name, dev_id, target_tab) {
        if (tab_name == 'tab-status') {
            AI.deviceSimpleCommand(dev_id, "shell getprop", function (hasError, stdout, stderr) {
                target_tab.html(stdout.replace(/\n/g, "<br />"));
            });
        } else if (tab_name == 'tab-syslog') {
            DeviceLog.pipLog(dev_id, target_tab);
        }
    },
    bindDevTabsClick: function () {
        var self = this;
        $('#deviceTab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var dev_id = $('#singledevid').val();
            if (dev_id == "") {
                return;
            }
            var tab_name = $(e.target).attr('href').replace("#", "");
            var target_tab = $('#' + tab_name);
            self.tabClick(tab_name, dev_id, target_tab);
        });
    },
    syncDevList: function (force) {
        var self = this;
        if (force == true) {
            // 清空列表
            $('#devlist').html("");
        }
        AndroidDevice.fetchDevLists(function (devLists) {

            for (x in devLists) {
                var dev = devLists[x];
                var devCol = $('.dev_template_original').clone();
                devCol.attr('devid', dev[0]);
                var dev_name = dev[0];
                if (localStorage != null) {
                    dev_name = localStorage.getItem("alias_" + dev[0]) != null ?
                        localStorage.getItem("alias_" + dev[0]) : dev_name;
                    if (localStorage.getItem("alias_" + dev[0]) == null) {
                        // 太坑爹了. 算了. 异步就异步吧.
                        (function (dev_name, devid) {
                            AndroidDevice.adbDeviceSimpleCommand(devid, {
                                shell: "shell cat /system/build.prop",
                                silent: true
                            }, function (hasErr, stdout, stderr) {
                                // 将品牌+型号作为默认值放入ls
                                var datas = stdout.match(/ro\.product\.brand=(.*)/);
                                var brand = datas != null && datas.length == 2 ? datas[1] : "";
                                var datas = stdout.match(/ro\.product\.model=(.*)/);
                                var model = datas != null && datas.length == 2 ? datas[1] : "";
                                if (brand != "" || model != "") {
                                    localStorage.setItem("alias_" + dev_name, brand + " " + model);
                                } else {
                                    localStorage.setItem("alias_" + dev_name, devid);
                                }
                            });
                        })(dev_name, dev[0]);
                    }
                }
                devCol.find('.devname').html(dev_name);
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
                self.bindDeviceCol(devCol);
                devCol.show();
                // 非强制更新的时候只更新变化的节点
                if (force == false) {
                    // 找是否有此节点了 没有就插入 有则更新状态
                    devtr = $("tr[devid=\"" + dev[0] + "\"]");

                    if (devtr.get(0) == undefined) {
                        $('#devlist').append(devCol);
                        continue;
                    }
                    dev_old_id = devtr.find('.devid').attr('devid');
                    dev_old_name = devtr.find('.devname').html();
                    // devid不同 或者 name不同就替换
                    if (dev_old_id != devCol.find('.devid').attr('devid') ||
                        dev_old_name != devCol.find('.devname').html()) {
                        console.log("devid:\"" + dev[0] + "\" Status Changed");
                        devtr.replaceWith(devCol);
                        continue;
                    }
                    // others not update
                    continue;
                }
                $('#devlist').append(devCol);
            }
            // 反向找detached的device 处理他们的状态
            if (force == false) {
                $('#devlist').find('tr').each(function () {
                    var live_dev_id = $(this).attr('devid');
                    var isInList = false;
                    for (x in devLists) {
                        var dev = devLists[x];
                        // 存在就不处理了
                        if (dev[0] == live_dev_id) {
                            isInList = true;
                            continue;
                        }
                    }
                    if (isInList == false) {
                        $(this).find('.btn-status').css('color', "grey");
                        $(this).find('.devid').attr('devid', "-1");
                    }
                });
            }
        }, !force);
    }
}