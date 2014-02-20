/**
 * Created by haku-mac on 14-2-8.
 */

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function jphack() {
    /**
     * 这个用来给select设置默认值
     * <select cval=xx> 初始化会选中这个值
     */
    $("select").each(function () {
        $(this).val($(this).attr('cval'));
    });

    /**
     * 这个用来给checkallbox设置默认值
     * < class="checkallbox" cval=xx>
     * 会联动选中所有class=xx的子元素
     */
    $(".checkallbox").each(function () {
        $(this).click(function () {
            sclassname = $(this).attr('cval');
            pcheck = $(this).prop("checked");
            $("." + sclassname).each(
                function () {
                    $(this).prop("checked", pcheck);
                }
            );

        });
    });

    /**
     * 这个用来给selectbox设置默认值
     * < class="selectbox" cval=xx>
     * 会联动选中所有class=xx的子元素
     */
    $(".selectbox").each(function () {
        $(this).click(function () {
            sclassname = $(this).attr('cval');
            pcheck = $(this).prop("selected");
            $("." + sclassname).each(
                function () {
                    $(this).prop("selected", pcheck);
                }
            );
        });
    });


}