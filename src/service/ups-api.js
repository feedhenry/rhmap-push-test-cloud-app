"use strict";

const request = require("request");
const Message = require("../model/message");
const Criteria = require("../model/criteria");
const Logger = require("../util/logger");

const PUSH_URL = "https://testing.zeta.feedhenry.com/api/v2/ag-push/rest/sender";
const PUSH_BATCH_URL = `${PUSH_URL}/batch`;

/**
 * Helper class that encapsules UPS RestAPI.
 */
class UPSAPI {

    constructor(credentials) {
        this.pushApplicationID = credentials.pushApplicationID;
        this.masterSecret = credentials.masterSecret;
    }

    sendNotificationToAlias(alias, callback) {
        Logger.log(`[${alias}] Sending push using fh.push().`);

        const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
        const criteria = new Criteria();
        criteria.alias = [alias];

        const body = { message, criteria };

        this.post(PUSH_URL, callback, body);
    }

    sendNotificationsToAliasesInBatch(aliases, callback) {
        const notifications = aliases.map(alias => {
            const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
            const criteria = new Criteria();
            criteria.alias = [alias];

            return { message, criteria };
        });

        this.post(PUSH_BATCH_URL, callback, notifications);
    }

    sendNotificationToVariant(variant, callback) {
        const message = new Message(`Hello ${variant} from rhmap-push-cloud-app!`);
        const criteria = new Criteria();
        criteria.variants = [variant];

        const body = { message, criteria };

        this.post(PUSH_URL, callback, body);
    }

    sendNotificationToVariants(variants, callback) {
        const message = new Message(`Hello ${variants.length} variants from rhmap-push-cloud-app!`);
        const criteria = new Criteria();
        criteria.variants = variants;

        const body = { message, criteria };

        this.post(PUSH_URL, callback, body);
    }

    post(url, callback, body) {
        request.post(url, callback)
            .json(body)
            .auth(this.pushApplicationID, this.masterSecret);
    }

}

module.exports = UPSAPI;
