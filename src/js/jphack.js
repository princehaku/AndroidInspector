/**
 * Created by haku-mac on 14-2-8.
 */


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