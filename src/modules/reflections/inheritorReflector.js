import * as path from "path";
import * as fs from "fs";
import "reflect-metadata";

export function discoverUnusedClasses(directory) {
    const classes = [];

    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (path.extname(file) === ".js") {
            const dynamic = require(`../commands/${file}`);
            const module = Object.values(dynamic)[0];
            if (module && file !== "commandLoader.js") {
                const instance = new module();
                if (instance && instance.cmd) {
                    classes.push(instance);
                }
            }
        }
    }

    return classes;
}
