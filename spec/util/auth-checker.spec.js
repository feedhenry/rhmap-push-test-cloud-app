"use strict";

const fs = require("fs");
const AuthChecker = require("../../src/util/auth-checker");

describe("AuthChecker", () => {

    const wrongFilePath = "./test-jasmine-auth-wrong.json";
    const validFilePath = "./test-jasmine-auth.json";

    const validJson = {
        appId0: {
            pushApplicationID: "12345",
            masterSecret: "supersecret!"
        },
        appId1: {
            pushApplicationID: "67890",
            masterSecret: "supersecret!"
        }
    };

    const wrongJson = {
        pushApplicationID: "12345",
        masterSecret: "supersecret!"
    };

    describe(".checkAuthFile", () => {

        it("should throw an error if the JSON file is not correctly formatted", () => {
            const checker = new AuthChecker();

            spyOn(checker, "readDataFromJSON").and.returnValue(wrongJson);

            expect(checker.checkAuthFile).toThrowError();
        });

    });

    describe(".readDataFromJSON", () => {

        beforeAll(() => {
            fs.writeFileSync(validFilePath, JSON.stringify(validJson));
            fs.writeFileSync(wrongFilePath, JSON.stringify(wrongJson));
        });

        afterAll(() => {
            fs.unlinkSync(validFilePath);
            fs.unlinkSync(wrongFilePath);
        });

        it("should throw an error if the JSON file is not in the specified path", () => {
            const checker = new AuthChecker("some path");

            expect(checker.checkAuthFile).toThrowError();
        });

        it("should throw an error if the JSON file is not in the default path", () => {
            const checker = new AuthChecker();

            spyOn(checker, "defaultPath").and.returnValue("some path");

            expect(checker.checkAuthFile).toThrowError();
        });

        it("should parse a valid json file into a dictionary with app credentials", () => {
            const checker = new AuthChecker(validFilePath);

            const dictionary = checker.readDataFromJSON();

            expect(dictionary).toEqual(validJson);
        });

    });

    describe(".getCredentialsForAppId", () => {

        it("should call readDataFromJSON only once", () => {
            const checker = new AuthChecker(validFilePath);

            spyOn(checker, "readDataFromJSON").and.returnValue(validJson);

            checker.getCredentialsForAppId("");
            checker.getCredentialsForAppId("");
            checker.getCredentialsForAppId("");

            expect(checker.readDataFromJSON.calls.count()).toBe(1);
        });

        it("should return the pushApplicationID and masterSecret of an app", () => {
            const checker = new AuthChecker();

            spyOn(checker, "readDataFromJSON").and.returnValue(validJson);

            const credentials = checker.getCredentialsForAppId("appId0");

            expect(credentials).toEqual(validJson.appId0);

        });

    });

});
