/**
 * Created by haku-mac on 14-2-19.
 */
DeviceLog = {
    maxLength: 1000,
    logData: {},
    log: function (dev_id, message, type) {
        if (logData.dev_id == undefined) {
            logData.dev_id = [];
        }
    }
}