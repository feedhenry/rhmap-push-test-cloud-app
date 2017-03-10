"use strict";

const winston = require("winston");
const fs = require("fs");

const DEFAULT_PATH_LOG_FILE = "public/push.log";

class LoggerHelper {

    constructor(path) {
        this.path = path || DEFAULT_PATH_LOG_FILE;
    }

    init() {
        if (fs.existsSync(this.path)) {
            fs.unlinkSync(this.path);
        }

        winston.configure({
            transports: [
                new winston.transports.File({ filename: this.path })
            ]
        });
    }

    static log(msg) {
        winston.info(msg);
    }

    static error(msg) {
        winston.error(msg);
    }

}

module.exports = LoggerHelper;
