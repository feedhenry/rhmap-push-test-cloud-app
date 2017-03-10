"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const async = require("async");
const Logger = require("../util/logger");
const UPSAPI = require("../service/ups-api");
const CallbackFactory = require("../service/api-callback-factory");

const pushUPS = new express.Router();

pushUPS.use(cors());
pushUPS.use(bodyParser());

/**
 * Send a notification to a single alias.
 * App's pushApplicationID and masterSecret must be provided via basic auth.
 *
 * @param appId ID of the mobile app that will be target of the notification.
 * @param alias Alias that will be target of the notification.
 */
pushUPS.get("/:appId/:alias", (request, response) => {
    const appId = request.params.appId;
    const alias = request.params.alias;

    Logger.log(`[${appId}] Sending push to ${alias} using UPS RestAPI.`);

    new UPSAPI(appId)
        .sendNotificationToAlias(alias, CallbackFactory.getCallback(response, appId, alias));
});

/**
 * Send a push notification to a list of aliases using UPS RestAPI in an async.each() loop. That is, all notifications will be sent simoultaniously but in different requests.
 * App's pushApplicationID and masterSecret must be provided via basic auth.
 * The list of aliases must be provided in the request's body in form of array.
 * @param appId pushApplicationID of the mobile app that has the devices.
 */
pushUPS.post("/:appId", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices asynchronously using UPS RestAPI.`);

    const api = new UPSAPI(appId);
    async.each(aliases,
        alias => api.sendNotificationToAlias(alias, CallbackFactory.getCallback(response, appId, alias)),
        err => Logger.error(`[${appId}] Async Error: ${err}.`)
    );

    response.send(`Sending push to ${aliases.length} devices asynchronously. Check the Cloud App logs for results.`);
});

/**
 * Send a batch of notifications to different aliases using UPS RestAPI in a single request.
 * App's pushApplicationID and masterSecret must be provided via basic auth.
 * A list of aliases must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushUPS.post("/:appId/batch", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices in a batch using UPS RestAPI.`);

    new UPSAPI(appId)
        .sendNotificationsToAliasesInBatch(aliases, CallbackFactory.getCallback(response, appId));
});

module.exports = pushUPS;
