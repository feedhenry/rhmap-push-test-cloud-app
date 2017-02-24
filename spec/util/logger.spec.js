"use strict";

const fs = require("fs");
const Logger = require("../../src/util/logger");

describe("Logger", () => {

    let fakePath;
    let logger;

    beforeEach(() => {
        fakePath = `${Date.now()}.log`;
        logger = new Logger(fakePath);
    });

    afterEach(() => {
        logger = undefined;
        if (fs.existsSync(fakePath)) {
            fs.unlinkSync(fakePath);
        }
    });

    describe(".init", () => {

        it("should remove the previous log file if it exists", () => {
            fs.writeFileSync(fakePath);

            expect(fs.existsSync(fakePath)).toBeTruthy();

            logger.init();

            expect(fs.existsSync(fakePath)).toBeFalsy();
        });

    });

    describe(".log", () => {

        it("should create a new log file if it did not exist already", done => {
            logger.init();

            expect(fs.existsSync(fakePath)).toBeFalsy();

            Logger.log("test");

            // Workaround, winston is async and callback does not work
            setTimeout(() => {
                expect(fs.existsSync(fakePath)).toBeTruthy();
                done();
            }, 100);
        });

        it("should add a new line into a existing log file", done => {
            logger.init();

            fs.writeFileSync(fakePath, "First line\n");

            const dataBefore = fs.readFileSync(fakePath, "utf-8");
            const linesBefore = dataBefore.split(/\r?\n/g).length;

            Logger.log("Second line");

            // Workaround, winston is async and callback does not work
            setTimeout(() => {
                const dataAfter = fs.readFileSync(fakePath, "utf-8");
                const linesAfter = dataAfter.split(/\r?\n/g).length;
                const diff = linesAfter - linesBefore;

                expect(diff).toBe(1);
                done();
            }, 100);
        });

    });

});
