/**
 * Created by haku-mac on 14-2-7.
 * for device lists
 */
var AndroidDevice = {
    fetchDevLists: function (callback) {
        if (typeof (require) != 'function') {
            stdout = "stdout: List of devices attached \n1329f0a5-test1\tdevice\n95f0a123-test3\tdevice\n1329f0a5xbc-test2\tdevice(un authorised)\n\n";
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
            return;
        }
        this.adbSimpleCommand('devices',
            function (hasError, stdout, stderr) {
                console.log('stdout: ' + stdout);
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
            self.adbSimpleCommand(" -s " + dev_id + " " + args, callback);
        });
    },
    /**
     * 执行简单adb命令(可以立即有返回值)
     */
    adbSimpleCommand: function (args, callback) {
        var exec = require('child_process').exec;
        var command_line = "\"" + localStorage.adbPath + 'adb" ' + args;
        console.info("exec " + command_line);
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