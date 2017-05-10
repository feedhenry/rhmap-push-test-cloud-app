"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const async = require("async");
const Logger = require("../util/logger");
const FHAPI = require("../service/fh-api");
const CallbackFactory = require("../service/api-callback-factory");

const pushFH = new express.Router();

pushFH.use(cors());
pushFH.use(bodyParser());

/**
 * Send a notification to a single alias.
 * @param appId ID of the mobile app that will be target of the notification.
 * @param alias Alias that will be target of the notification.
 */
pushFH.get("/:appId/:alias", (request, response) => {
    const appId = request.params.appId;
    const alias = request.params.alias;

    Logger.log(`[${appId}] Sending push to ${alias} using fh.push().`);

    FHAPI.sendNotificationToAlias(alias, CallbackFactory.getCallback(response, alias));
});

/**
 * Send a push notification to a list of aliases using $fh.push in an async.each() loop. That is, all notifications will be sent simultaneously but in different requests.
 * The list of aliases must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that has the devices.
 */
pushFH.post("/:appId", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices asynchronously using fh.push().`);

    async.each(aliases,
        alias => FHAPI.sendNotificationToAlias(alias, CallbackFactory.getCallback(response, alias)),
        err => Logger.error(`[${appId}] Async Error: ${err}.`)
    );

    response.send(`Sending push to ${aliases.length} devices asynchronously. Check the Cloud App logs for results.`);
});

/**
 * Send a batch of notifications to different aliases using $fh.push in a single request.
 * A list of aliases must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushFH.post("/:appId/batch", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices in a batch using fh.push().`);

    FHAPI.sendNotificationToAliasesInBatch(aliases, CallbackFactory.getCallback(response, appId));
});

/**
 * Send a push notification to a single variant using $fh.push.
 * @param appId ID of the mobile app that has the devices.
 * @param variantId ID of variant that will be receiving the notification.
 */
pushFH.get("/:appId/variants/:variantId", (request, response) => {
    const appId = request.params.appId;
    const variantId = request.params.variantId;

    Logger.log(`[${appId}] Sending push to variant: ${variantId} using fh.push().`);

    FHAPI.sendNotificationToVariant(variantId, CallbackFactory.getCallback(response, variantId));
});

module.exports = pushFH;
