"use strict";

const Logger = require("../util/logger");

class APICallbackFactory {

    static getCallback(response, receiver) {
        return (err, res) => {
            if (err) {
                Logger.log(`[${receiver}] CloudApp error: ${err}`);
                response.status(500).send(err);

            } else if (res) {
                Logger.log(`[${receiver}] Response (${res.statusCode}): ${res.body}`);
                response.status(res.statusCode).send(res.body);

            } else {
                Logger.log(`[${receiver}] No error or response.`);
                response.send("No response");
            }
        };
    }
}

module.exports = APICallbackFactory;
