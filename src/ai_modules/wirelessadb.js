/**
 * Created by haku-mac on 14-2-10.
 */
wirelessadb = {
    init: function () {
        $('#wireless-btn').click(function () {
            $('#moduleModal').modal("hide");

            device_url = $("#wirelessadb-url").val();
            AI.adbSimpleCommand({shell: "connect " + device_url, tips: "connecting"},
                function (hasError, stdout, stderror) {
                    if (hasError) {
                        alert(stderror);
                    } else {
                        alert(stdout);
                    }
                });
        });
    }
}
