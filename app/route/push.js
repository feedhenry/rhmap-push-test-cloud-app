"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const $fh = require("fh-mbaas-api");
const async = require("async");
const Message = require("../model/message");
const Options = require("../model/options");
const Logger = require("../util/logger");

const pushRoute = new express.Router();

pushRoute.use(cors());
pushRoute.use(bodyParser());

/**
 * Endpoint for sending push to a list of aliases.
 * The body must contain an array of aliases.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushRoute.post("/:appId", (request, response) => {
  const appId = request.params.appId;

  const message = new Message("Hello from node backend!");
  const options = new Options();
  options.appId = appId;

  const aliases = request.body;
  Logger.log(`[${appId}] Sending push to ${aliases.length} devices asynchronously.`);
  async.each(aliases, alias => {
    options.alias = alias;
    Logger.log(`[${alias}] Sending push using fh.push().`);
    $fh.push(message, options, fhPushCallback(response, appId, alias));
  },
    err => Logger.error(`[${appId}] [${options.alias}] Async Error: ${err}.`)
  );

  response.send(`Notifications are being sent for ${aliases.length}. Check the results in the Cloud App logs.`)
});

/**
 * Endpoint for sending push to a list of aliases using the batch endpoint.
 * The body must contain an array of aliases.
 * @param appId ID of the mobile app that will be target of the notification.
 */
pushRoute.post("/:appId/batch", (request, response) => {
  // TODO
  response.status(200)
    .send("Not yet implemented");
  // const appId = request.params.appId;
  // const aliases = request.body;

  // Logger.log(`[${appId}] Sending push to ${aliases.length} devices in a batch.`);
  // const messages = aliases.map(alias => {
  //   const message = new Message(`Hello ${alias} from node backend!`);
  //   const options = new Options();
  //   options.alias = alias;
  //   return { message, options };
  // });

  // $fh.push(messages, fhPushCallback(response, appId));
});

/**
 * Endpoint for sending push to 1 device
 * @param appId ID of the mobile app that will be target of the notification.
 * @param alias Alias that will be target of the notification.
 */
pushRoute.get("/:appId/:alias", (request, response) => {
  const appId = request.params.appId;
  const alias = request.params.alias;

  const message = new Message("Hello from node backend!");
  const options = new Options();
  options.appId = appId;
  options.alias = alias;

  Logger.log(`[${alias}] Sending push to using fh.push().`);
  $fh.push(message, options, fhPushCallback(response, appId, alias));
});

function fhPushCallback(response, appId, alias) {
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

module.exports = pushRoute;
