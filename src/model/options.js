"use strict";

const Criteria = require("./criteria");
const Config = require("./config");

const DEFAULT_OPTIONS_BROADCAST = false;

class Options {
    constructor() {
        this.config = new Config();
        this.criteria = new Criteria();
        this.apps = [];
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
}

module.exports = Options;
