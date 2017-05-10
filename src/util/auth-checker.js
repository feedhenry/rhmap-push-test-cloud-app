"use strict";

const path = require("path");
const fs = require("fs");

const DEFAULT_JSON_PATH = path.join(__dirname, "../../", "app-auth.json");

class AuthChecker {

    constructor(customPath) {
        this.path = customPath || this.defaultPath();
    }

    checkAuthFile() {
        const parsedData = this.readDataFromJSON();

        for (const appId in parsedData) {
            const credentials = parsedData[appId];
            if (!credentials.pushApplicationID || !credentials.masterSecret) {
                throw new Error("Bad format of app-auth.json. It must be a dictionary <appId, credentials>, 'credentials' containing pushApplicationID and masterSecret");
            }
        }

        this.dictionary = parsedData;
    }

    readDataFromJSON() {
        // TODO: check that the file exists
        const data = fs.readFileSync(this.path, "utf8");

        return JSON.parse(data);
    }

    getCredentialsForAppId(appId) {
        if (!this.dictionary) {
            this.dictionary = this.readDataFromJSON();
        }

        return this.dictionary[appId];
    }

    defaultPath() {
        return DEFAULT_JSON_PATH;
    }
}

module.exports = AuthChecker;
