"use strict";

const request = require("request");

const PUSH_URL = "http://testing.eteam.skunkhenry.com/api/v2/ag-push/rest/sender";
const PUSH_BATCH_URL = PUSH_URL + "/batch"

class API {

    static sendNotificationToApp(options, callback) {
        const body = {
            "message": {
                "alert": "Hello from node backend!",
                "sound": "default"
            },
            "criteria": {
                "alias": [options.alias]
            }
        };

        request.post(PUSH_URL, callback)
            .json(body)
            .auth(options.pushApplicationID, options.masterSecret);
    }

    static sendBatchOfNotificationsToApp(app, aliases, callback) {
        const body = aliases.map(alias => {
            return {
                "message": {
                    "alert": `Hello ${alias} from node backend!`,
                    "sound": "default"
                },
                "criteria": {
                    "alias": [alias]
                }
            }
        });

        request.post(PUSH_BATCH_URL, callback)
            .json(body)
            .auth(app.pushApplicationID, app.masterSecret);
    }
}

module.exports = API;
