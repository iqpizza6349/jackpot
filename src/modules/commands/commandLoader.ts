import { discoverUnusedClasses } from "../reflections/inheritorReflector";
import { ICommand } from "./ICommand";

export function findCommands(): any[] {
    return findDynamicCommands().map((v) => {
        if (v.permissions().length === 0) {
            return {
                name: v.name(), 
                description: v.description(),
                options: (v.options().length === 0) ? [] : v.options()
            };
        }
        else {
            return {
                name: v.name(), 
                description: v.description(),
                options: (v.options().length === 0) ? [] : v.options(),
                default_member_permissions: v.permissions().map((v) => v.toString())
            };
        }
    });
}

export function findDynamicCommands(): ICommand[] {
    return discoverUnusedClasses(__dirname);
}
