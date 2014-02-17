/**
 * Created by haku-mac on 14-2-10.
 */
wirelessadb = {
    init: function () {
        $('#wireless-btn').click(function () {
            $('#moduleModal').modal("hide");

            device_url = $("#wirelessadb-url").val();
            AI.adbSimpleCommand(" connect " + device_url, "connecting", function (hasError, stdout, stderror) {
                if (hasError) {
                    alert(stderror);
                } else {
                    alert(stdout);
                }
            });
        });
    }
}
