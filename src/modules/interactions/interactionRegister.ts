import { Client } from "discord.js";
import { ICommand } from "../commands/ICommand";
import { register } from "./playerRegister";

export class InteractionRegister {

    private _client: Client;

    constructor(client: Client) {
        this._client = client;
    }

    addReadyInteraction() {
        this._client.on("ready", () => {
            console.log(`Logged in as ${this._client.user?.tag}`);
        });
    }

    addSlashCommands(commands: ICommand[]) {
        this._client.on("interactionCreate", async interation => {
            if (!interation.isChatInputCommand()) {
                return;
            }

            await register(interation.user.id);
            commands.map(async (cmd) => {
                await cmd.action(interation);
            });
        });
    }
}
