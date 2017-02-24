"use strict";

const Logger = require("../util/logger");

class APICallbackFactory {

    static getCallback(response, appId, alias) {
        return (err, res) => {
            if (err) {
                Logger.log(`[${alias || appId}] CloudApp error: ${err}`);
                response.status(500).send(err);

            } else if (res) {
                Logger.log(`[${alias || appId}] Response (${res.statusCode}): ${res.body}`);
                response.status(res.statusCode).send(res.body);

            } else {
                Logger.log(`[${alias || appId}] No error or response.`);
                response.send("No response");
            }
        };
    }
}

module.exports = APICallbackFactory;
