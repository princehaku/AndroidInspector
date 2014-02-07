/**
 * Created by haku-mac on 14-2-7.
 * for device lists
 */
var AndroidDevice = {
    adbPath: "",
    init: function () {
    },
    fetchDevLists: function (callback) {
        this.adbSingleCommand('devices',
            function (hasError, stdout, stderr) {
                console.log('stdout: ' + stdout);
                if (hasError) {
                    throw "不能运行 adb " + stderr;
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
                    devlist.push(seg);
                }
                callback(devlist)
            })
    },
    install: function (dev_id, loc_file_path) {

    },
    adbSingleCommand: function (args, callback) {
        var exec = require('child_process').exec,
        command_line = '/Users/haku-mac/Documents/AndroidSDK/platform-tools/adb ' + args;
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