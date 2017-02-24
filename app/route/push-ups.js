"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const async = require("async");
const Logger = require("../util/logger");
const API = require("../service/ups-api");

const pushUPSRoute = new express.Router();

pushUPSRoute.use(cors());
pushUPSRoute.use(bodyParser());

/**
 * Endpoint for sending push to a list of aliases.
 * pushApplicationID and masterSecret must be sent as query parameters "user" and "pass"
 * The body must contain an array of aliases.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushUPSRoute.post("/:appId", (request, response) => {
    const appId = request.params.appId;
    const pushApplicationID = request.param("user");
    const masterSecret = request.param("pass");
    const aliases = request.body;

    const options = {
        pushApplicationID,
        masterSecret
    }

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices asynchronously.`);
    async.each(aliases, alias => {
        options.alias = alias;

        Logger.log(`[${alias}] Sending push to using UPS API.`);
        API.sendNotificationToApp(options, restAPICallback(response, appId, alias))
    },
        err => Logger.error(`[${appId}] [${options.alias}] Async Error: ${err}.`)
    );

    response.send(`Notifications are being sent for ${aliases.length}. Check the results in the Cloud App logs.`)
});

/**
 * Endpoint for sending push to a list of aliases using the batch endpoint.
 * pushApplicationID and masterSecret must be sent as query parameters "user" and "pass"
 * The body must contain an array of aliases.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushUPSRoute.post("/:appId/batch", (request, response) => {
    const appId = request.params.appId;
    const pushApplicationID = request.param("user");
    const masterSecret = request.param("pass");
    const aliases = request.body;

    const app = {
        pushApplicationID,
        masterSecret
    }

    Logger.log(`[${appId}] Sending push to ${aliases.length} devices in a batch.`);
    API.sendBatchOfNotificationsToApp(app, aliases, restAPICallback(response, appId))
});

/**
 * Endpoint for sending push to 1 device
 * pushApplicationID and masterSecret must be sent as query parameters "user" and "pass"
 * @param appId ID of the mobile app that will be target of the notification.
 * @param alias Alias that will be target of the notification.
 */
pushUPSRoute.get("/:appId/:alias", (request, response) => {
    const appId = request.params.appId;
    const alias = request.params.alias;
    const pushApplicationID = request.param("user");
    const masterSecret = request.param("pass");

    const options = {
        alias,
        pushApplicationID,
        masterSecret
    }

    Logger.log(`[${alias}] Sending push to using UPS API.`);
    API.sendNotificationToApp(options, restAPICallback(response, appId, alias))
});

function restAPICallback(response, appId, alias) {
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
    }
}

module.exports = pushUPSRoute;
