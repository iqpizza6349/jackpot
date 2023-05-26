import { ICommand } from "../ICommand";

const commands: ICommand[] = [];

export function Cmd(constructor) {
    console.log(constructor);
    const clazz = constructor as ICommand;
    commands.push(clazz);
}

export function getCommands() {
    return commands;
}

export function getDetails() {
    return commands.map((v) => {
        return `name: ${v.name}, describe: ${v.description}`;
    });
}
