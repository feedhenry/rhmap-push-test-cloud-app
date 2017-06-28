"use strict";

const $fh = require("fh-mbaas-api");
const Logger = require("../util/logger");
const Message = require("../model/message");
const Options = require("../model/options");

/**
 * Helper class that encapsules fh-mbaas-api.
 */
class FHAPI {

    static sendNotificationToAlias(alias, callback) {
        Logger.log(`[${alias}] Sending push using fh.push().`);

        const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
        const options = new Options();
        options.alias = alias;

        $fh.push(message, options, callback);
    }

    static sendNotificationsToAliasesInBatch(aliases, callback) {
        // TODO: waiting for fh-mbaas-api implementation
        // const notifications = aliases.map(alias => {
        //     const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
        //     const options = new Options();
        //     options.alias = alias;

        //     return { message, options };
        // });

        // $fh.push(notifications, callback);
        callback(undefined, { statusCode: 404, body: "Not yet implemented" });
    }

    static sendNotificationToVariant(variant, callback) {
        Logger.log(`[${variant}] Sending push using fh.push().`);

        const message = new Message(`Hello ${variant} from rhmap-push-cloud-app!`);
        const options = new Options();
        options.variant = variant;

        $fh.push(message, options, callback);
    }

    static sendNotificationToVariants(variants, callback) {
        Logger.log(`[${variants.length} variants] Sending push using fh.push().`);

        const message = new Message(`Hello ${variants.length} variants from rhmap-push-cloud-app!`);
        const options = new Options();
        options.variants = variants;

        $fh.push(message, options, callback);
    }
}

module.exports = FHAPI;
