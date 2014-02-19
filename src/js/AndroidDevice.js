/**
 * Created by haku-mac on 14-2-7.
 * for device lists
 */
var AndroidDevice = {
    fetchDevLists: function (callback, slient_mode) {
        this.adbSimpleCommand({
                shell: 'devices',
                slient: slient_mode
            },
            function (hasError, stdout, stderr) {
                if (slient_mode != true) {
                    console.log('stdout: ' + stdout);
                }
                if (hasError) {
                    throw "Can't Run adb " + stderr;
                    return;
                }
                devices = stdout.split("\n");
                devlist = [];
                for (x in devices) {
                    seg = devices[x].split("\t");
                    // 非两段的直接返回
                    if (seg.length != 2) {
                        continue;
                    }
                    seg[0] = seg[0].replace(/(^\s*)|(\s*$)/g, "");
                    seg[1] = seg[1].replace(/(^\s*)|(\s*$)/g, "");
                    devlist.push(seg);
                }
                callback(devlist)
            })
    },
    /**
     * 执行单个设备的adb命令
     */
    adbDeviceSimpleCommand: function (dev_id, args, callback) {
        var self = this;
        // 前置心跳检测一下 防止block
        this.adbSimpleCommand(" -s " + dev_id + " shell uptime", function (hasError, stdout, stderr) {
            if (hasError) {
                callback(true, stdout, stderr);
                return;
            }
            if (args.hasOwnProperty("shell")) {
                var command_line = " -s " + dev_id + " " + args.shell;
            } else {
                var command_line = " -s " + dev_id + " " + args;
            }
            self.adbSimpleCommand(command_line, callback);
        });
    },
    /**
     * 执行简单adb命令(可以立即有返回值)
     */
    adbSimpleCommand: function (args, callback) {
        var exec = require('child_process').exec;
        if (args.hasOwnProperty("shell")) {
            var command_line = "\"" + localStorage.adbPath + 'adb" ' + args.shell;
        } else {
            var command_line = "\"" + localStorage.adbPath + 'adb" ' + args;
        }
        if (!(args.hasOwnProperty("slient") && args.slient == true)) {
            console.info("exec " + command_line);
        }
        child = exec(command_line,
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
                callback(hasError, stdout, stderr);
            });

        child.unref();
    }
}