"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const async = require("async");
const Logger = require("../util/logger");
const UPSAPI = require("../service/ups-api");
const CallbackFactory = require("../service/api-callback-factory");
const AuthChecker = require("../util/auth-checker");

const pushUPS = new express.Router();

pushUPS.use(cors());
pushUPS.use(bodyParser());

const authChecker = new AuthChecker();

/**
 * Send a notification to a single alias.
 * App's ID and masterSecret must be provided via basic auth.
 *
 * @param appId ID of the mobile app that will be target of the notification.
 * @param alias Alias that will be target of the notification.
 */
pushUPS.get("/:appId/alias/:alias", (request, response) => {
    const appId = request.params.appId;
    const alias = request.params.alias;

    Logger.log(`[${appId}] Sending push to ${alias} using UPS RestAPI.`);

    const credentials = authChecker.getCredentialsForAppId(appId);
    if (credentials) {
        new UPSAPI(credentials)
            .sendNotificationToAlias(alias, CallbackFactory.getCallback(response, alias));
    } else {
        response.status(404).send(`AppId not found: ${appId}`);
    }
});

/**
 * Send a push notification to a list of aliases using UPS RestAPI in an async.each() loop. That is, all notifications will be sent simoultaniously but in different requests.
 * App's ID and masterSecret must be provided via basic auth.
 * The list of aliases must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that has the devices.
 */
pushUPS.post("/:appId/alias", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices asynchronously using UPS RestAPI.`);

    const credentials = authChecker.getCredentialsForAppId(appId);
    if (credentials) {
        const api = new UPSAPI(credentials);
        async.each(aliases,
            alias => api.sendNotificationToAlias(alias, CallbackFactory.getCallback(response, alias)),
            err => Logger.error(`[${appId}] Async Error: ${err}.`)
        );

        response.send(`Sending push to ${aliases.length} devices asynchronously. Check the Cloud App logs for results.`);
    } else {
        response.status(404).send(`AppId not found: ${appId}`);
    }
});

/**
 * Send a batch of notifications to different aliases using UPS RestAPI in a single request.
 * App's ID and masterSecret must be provided via basic auth.
 * A list of aliases must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushUPS.post("/:appId/alias/batch", (request, response) => {
    const appId = request.params.appId;
    const aliases = request.body;

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices in a batch using UPS RestAPI.`);

    const credentials = authChecker.getCredentialsForAppId(appId);
    if (credentials) {
        new UPSAPI(credentials)
            .sendNotificationsToAliasesInBatch(aliases, CallbackFactory.getCallback(response, appId));
    } else {
        response.status(404).send(`AppId not found: ${appId}`);
    }
});

/**
 * Send a push notification to a single variant using UPS RestAPI.
 * App's ID and masterSecret must be provided via basic auth.
 * @param appId ID of the mobile app that has the devices.
 * @param variantId Id of the variant that will be receiving the notification.
 */
pushUPS.get("/:appId/variants/:variantId", (request, response) => {
    const appId = request.params.appId;
    const variantId = request.params.variantId;

    Logger.log(`[${appId}] Sending push to variant: ${variantId} using UPS RestAPI.`);

    const credentials = authChecker.getCredentialsForAppId(appId);
    if (credentials) {
        new UPSAPI(credentials)
            .sendNotificationToVariant(variantId, CallbackFactory.getCallback(response, variantId));
    } else {
        response.status(404).send(`AppId not found: ${appId}`);
    }
});

/**
 * Send a push notification to a multiple variant using UPS RestAPI.
 * App's ID and masterSecret must be provided via basic auth.
 * A list of variant IDs must be provided in the request's body in form of array.
 * @param appId ID of the mobile app that has the devices.
 */
pushUPS.post("/:appId/variants", (request, response) => {
    const appId = request.params.appId;
    const variants = request.body;

    Logger.log(`[${variants.length} variants] Sending push using UPS RestAPI.`);

    const credentials = authChecker.getCredentialsForAppId(appId);
    if (credentials) {
        new UPSAPI(credentials)
            .sendNotificationToVariants(variants, CallbackFactory.getCallback(response, `${variants.length} variants`));
    } else {
        response.status(404).send(`AppId not found: ${appId}`);
    }
});

module.exports = pushUPS;
