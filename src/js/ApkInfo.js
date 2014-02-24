/**
 * Created by haku-mac on 14-2-10.
 */

ApkInfo = {
    getPackageName: function (apk_path, callback) {
        this.packgeInfo(apk_path, function (package_info) {
            var packages = package_info.match("package: name='(.*?)'");
            if (packages == null) {
                callback("");
                return;
            }
            callback(packages[1]);
        });
    },
    getPackageStartIntent: function (apk_path, callback) {
        this.packgeInfo(apk_path, function (package_info) {
            var packages = package_info.match("launchable-activity: name='(.*?)'");
            if (packages == null) {
                callback("");
                return;
            }
            callback(packages[1]);
        });
    },
    packgeInfo: function (apk_path, callback) {
        var exec = require('child_process').exec,
            command_line = "\"" + localStorage.aaptPath + 'aapt" dump badging ' + apk_path;
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
                if (hasError) {
                    stdout = "";
                }
                callback(stdout);
            });
        child.unref();
    }
}