/**
 * Created by haku-mac on 14-2-19.
 */
DeviceLog = {
    maxLength: 3,
    logData: {},
    log: function (dev_id, message, type) {
        if (this.logData.dev_id == undefined) {
            this.logData.dev_id = [];
        }
        if (this.logData.dev_id.length > this.maxLength) {
            this.logData.dev_id.shift()
        }
        console.log(dev_id + "<p>" + message.replace(/\n/g, "<br />") + "</p>");
        this.logData.dev_id.push("<p>" + message.replace(/\n/g, "<br />") + "</p>");
    },
    getLogsHTML: function (dev_id) {
        if (this.logData.dev_id == undefined) {
            this.logData.dev_id = [];
        }
        return this.logData.dev_id.join("<br />");
    }
}