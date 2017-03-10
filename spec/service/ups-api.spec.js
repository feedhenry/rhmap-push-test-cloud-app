"use strict";

const UPSAPI = require("../../src/service/ups-api");
const Message = require("../../src/model/message");
const Criteria = require("../../src/model/criteria");

describe("UPSAPI", () => {

    let api;

    beforeAll(() => {
        spyOn(UPSAPI.prototype, "getCredentials").and.returnValue(
            {
                pushApplicationID: "id",
                masterSecret: "secret"
            }
        );
    });

    beforeEach(() => {
        api = new UPSAPI();
    });

    describe(".sendNotificationToAlias", () => {

        it("should send {message, criteria} in the body", () => {
            spyOn(api, "post");

            const alias = "alias";

            const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
            const criteria = new Criteria();
            criteria.alias = [alias];

            api.sendNotificationToAlias(alias);

            expect(api.post.calls.mostRecent().args[2]).toEqual({ message, criteria });
        });

    });

    describe(".sendNotificationsToAliasesInBatch", () => {

        it("should send an array of '{notification, criteria}' in the body", () => {
            spyOn(api, "post");

            const aliases = ["a1", "a2"];

            const notifications = aliases.map(alias => {
                const message = new Message(`Hello ${alias} from rhmap-push-cloud-app!`);
                const criteria = new Criteria();
                criteria.alias = [alias];

                return { message, criteria };
            });

            api.sendNotificationsToAliasesInBatch(aliases);

            expect(api.post.calls.mostRecent().args[2]).toEqual(notifications);
        });

    });

});
