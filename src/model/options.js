"use strict";

const Criteria = require("./criteria");
const Config = require("./config");

// TODO why is broadcast required? Broadcast is to send it to every device, right? https://github.com/fheng/millicore/blob/master/src/main/java/com/feedhenry/controller/UnifiedPushController.java#L71
const DEFAULT_OPTIONS_BROADCAST = true;

class Options {
    constructor() {
        this.config = new Config();
        this.criteria = new Criteria();
        this.apps;
        this.broadcast = DEFAULT_OPTIONS_BROADCAST;
        this.appId;
    }

    get alias() {
        return this.criteria.alias[0];
    }

    set alias(alias) {
        this.criteria.alias[0] = alias;
    }

    set appId(appId) {
        this.apps[0] = appId;
    }

    set variant(variant) {
        this.criteria.variants[0] = variant;
    }

    set variants(variants) {
        this.criteria.variants = variants;
    }
}

module.exports = Options;
