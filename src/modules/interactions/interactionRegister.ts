import { Client } from "discord.js";

export class InteractionRegister {

    private _client: Client;

    constructor(client: Client) {
        this._client = client;
    }

    addReadyInteraction() {
        this._client.on('ready', () => {
            console.log(`Logged in as ${this._client.user?.tag}`);
        });
    }

    addSlashCommand() {
        this._client.on('interactionCreate', async interation => {
            if (!interation.isChatInputCommand()) {
                return;
            }

            // TODO: do logic each command
        });
    }
}
