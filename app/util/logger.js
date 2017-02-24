"use strict";

const winston = require("winston");
const fs = require("fs");

const PATH_LOG_FILE = "public/push.log";

class LoggerHelper {

    static init() {
        if (fs.existsSync(PATH_LOG_FILE)) fs.unlinkSync(PATH_LOG_FILE);
        winston.add(winston.transports.File, { filename: PATH_LOG_FILE });
        winston.remove(winston.transports.Console);
    }

    static log(msg) {
        winston.info(msg);
    }

    static error(msg) {
        winston.error(msg);
    }

}

module.exports = LoggerHelper;
