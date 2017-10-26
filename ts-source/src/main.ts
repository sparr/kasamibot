let version = "1.0.0";

import {config} from "./config";
import * as Core from "./managers/Core";
import {command} from "./tools/Command";

try {

    if (config !== undefined) {
        if (Memory.settings === undefined) {
            Memory.settings = {};
            console.log("* * * * * * * * * * * * *");
            console.log(" Loading KasamiBot " + version + " ");
            console.log("* * * * * * * * * * * * *");
        }

        if (config.bot !== undefined) {
            if (Memory.settings.bot === undefined) {
                console.log("Running as bot: " + config.bot);
                Memory.settings.bot = config.bot;
            }
        }
        if (config.passive !== undefined) {
            if (Memory.settings.passive === undefined) {
                console.log("Running as passive bot: " + config.passive);
                Memory.settings.passive = config.passive;
            }
        }
        if (config.slow !== undefined) {
            if (Memory.settings.slow === undefined) {
                console.log("Running as slow bot: " + config.slow);
                Memory.settings.slow = config.slow;
            }
        }
        if (config.creditsToMaintain !== undefined) {
            if (Memory.settings.creditsToMaintain === undefined) {
                console.log("Credits to maintain: " + config.creditsToMaintain);
                Memory.settings.creditsToMaintain = config.creditsToMaintain;
            }
        }
        if (config.powerfocus !== undefined) {
            if (Memory.settings.powerfocus === undefined) {
                console.log("Focusing on power processing: " + config.powerfocus);
                Memory.settings.powerfocus = config.powerfocus;
            }
        }
    }
} catch (e) {
    console.log(`Exception while loading config: ${e}\n${e.stack}`);
}

export function loop() {
    Core.run();
    command.initCommands();
}
