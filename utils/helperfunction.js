const moment = require('moment-timezone');

function convertUTCtoIST(dateTime){
    if(!dateTime || !moment(dateTime, "YYYY-MM-DD HH:mm:ss", true).isValid()){
        return null;
    }

    return moment(dateTime)
        .utc().tz('Asia/Kolkata')
        .format("YYYY-MM-DD HH:mm:ss")
}

module.exports = convertUTCtoIST