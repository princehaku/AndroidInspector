/**
 * Created by haku-mac on 14-2-19.
 */
multishell = {
    init: function () {
        var self = this;
        // 安装按钮
        $('#multishell-btn').click(function () {
            $('#moduleModal').modal("hide");

            dev_list = AI.getSelectDevList();
            if (dev_list.length == 0) {
                alert("Please Select At Least One");
                return;
            }

            var command = $('#multishell-cmd').val();

            for (x in dev_list) {
                function fe(dev_id) {
                    AI.deviceSimpleCommand(dev_id, {
                        "shell" : "shell " + command,
                        "timeout" : 10000
                    }, function () {

                    });
                }

                fe(dev_list[x]);
            }
        });
    }
}