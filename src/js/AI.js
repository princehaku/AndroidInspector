/**
 * Created by haku-mac on 14-2-13.
 */
AI = {
    loadModule: function (module) {
        $('#moduleModal').modal("show");
        $('#moduleContainer').html('');
        url = "ai_modules/" + module + ".js";
        $.getScript(url, function () {
            $.ajax({
                url: "ai_modules/" + module + ".html",
                success: function (data) {
                    $('#moduleContainer').html(data);
                }
            });
        });
    },
    getSelectDevList: function () {
        devlist = [];
        $(".devid:checked").each(function () {
            if ($(this).attr("devid") != null && $(this).attr("devid") != "-1") {
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
    adbSimpleCommand: function (adb_shell, tips, callback) {
        var self = this;
        self.showProgress(tips);

        AndroidDevice.adbSimpleCommand(adb_shell,
            function (hasError, stdout, stderr) {
                self.hideProgress();
                if (callback != null) {
                    callback(hasError, stdout, stderr);
                }
            });

    },
    showProgress: function (tips) {
        $('#progress-tips').html(tips);
        $('#progressModal').modal({
            keyboard: false,
            show: true,
            backdrop: 'static'
        });
    },
    hideProgress: function () {
        $('#progressModal').modal("hide");
    }
}