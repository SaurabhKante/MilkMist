const moment = require('moment-timezone');

module.exports = {
    convertUTCtoIST: (dateTime) => {
         return moment(dateTime)
        .utc().tz('Asia/Kolkata')
        .format("YYYY-MM-DD HH:mm:ss")
    }
}