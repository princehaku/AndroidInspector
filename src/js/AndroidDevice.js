/**
 * Created by haku-mac on 14-2-7.
 * for device lists
 */
var AndroidDevice = {
    fetchDevLists: function (callback, silent_mode) {
        this.adbSimpleCommand({
                shell: 'devices',
                silent: silent_mode
            },
            function (hasError, stdout, stderr) {
                if (silent_mode != true) {
                    console.log('stdout: ' + stdout);
                }
                if (hasError) {
                    return [];
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
        if (typeof(args) == "string") {
            args = {
                shell: args
            }
        }
        var args1 = {};
        var args2 = {};
        $.extend(args1, args);
        $.extend(args2, args);
        args1.shell = " -s " + dev_id + " shell uptime";
        // 前置心跳检测一下 防止block
        this.adbSimpleCommand(args1, function (hasError, stdout, stderr) {
            if (hasError) {
                callback(true, stdout, stderr);
                return;
            }
            args2.shell = " -s " + dev_id + " " + args.shell;
            self.adbSimpleCommand(args2, callback);
        });
    },
    /**
     * 执行简单adb命令(可以立即有返回值)
     */
    adbSimpleCommand: function (args, callback) {
        var exec = require('child_process').exec;
        if (!args.hasOwnProperty("shell")) {
            args = {
                shell: args
            }
        }
        if (!(args.hasOwnProperty("silent") && args.silent == true)) {
            console.info("exec adb " + args.shell);
        }
        args.shell = "\"" + localStorage.adbPath + 'adb" ' + args.shell;
        var timeout = 0;
        if (!(args.hasOwnProperty("timeout"))) {
            timeout = args.timeout;
        }
        child = exec(args.shell, {
                encoding: 'utf8',
                timeout: timeout,
                maxBuffer: 200 * 1024,
                killSignal: 'SIGTERM',
                cwd: null,
                env: null
            },
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