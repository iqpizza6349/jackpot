import { REST, Routes } from "discord.js";

export class CommandRegister {
    private commands: any[];
    private clientId: string;
    private rest: REST;

    constructor(token: string, clientId: string, commands?: any[]) {
        this.commands = commands || [];
        this.clientId = clientId;
        this.rest = new REST({ version: '10' }).setToken(token);
    }

    async registerCommands() {
        await this.rest.put(Routes.applicationCommands(this.clientId), {
            body: this.commands
        });
    }

    getCommands(): any[] {
        return this.commands;
    }
}
