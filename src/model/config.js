"use strict";

const DEFAULT_CONFIG_TTL = -1;

class Config {
    constructor() {
        this.ttl = DEFAULT_CONFIG_TTL;
    }
}

module.exports = Config;
