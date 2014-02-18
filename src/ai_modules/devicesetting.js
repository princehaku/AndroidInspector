devicesetting = {
    init: function () {
        var key = $('#singledevid').val();
        var dev_old = localStorage.getItem("alias_" + key) != null ? localStorage.getItem("alias_" + key) : "";
        $('#devicesetting-name').val(dev_old);

        $('#devicesetting-btn').click(function () {
            var alias_name = $('#devicesetting-name').val();
            var key = $('#singledevid').val();
            if (alias_name != "") {
                localStorage.setItem("alias_" + key, alias_name);
                $('#moduleModal').modal("hide");
                MainPage.syncDevList(true);
            }
        });
    }
}