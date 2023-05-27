import { discoverUnusedClasses } from "../reflections/inheritorReflector";
import { ICommand } from './ICommand';

export function findCommands(): any[] {
    return findDynamicCommands().map((v) => {
        return {name: v.name(), description: v.description()};
    });
}

function findDynamicCommands(): ICommand[] {
    return discoverUnusedClasses(__dirname);
}
