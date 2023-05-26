import { Client, GatewayIntentBits } from "discord.js";
import { config } from 'dotenv';
import { InteractionRegister } from "./modules/interactions/interactionRegister";
import { ICommand } from "./modules/commands/ICommand";
import { Ping } from "./modules/commands/ping";
import { getCommands, getDetails } from "./modules/commands/decorator/cmd";

config();   // config '.env'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const interactionManager = new InteractionRegister(client);

// add interactions to work in bot
interactionManager.addReadyInteraction();

const ping = new Ping();
console.log(ping.name());
console.log(getCommands());
console.log(getDetails());

client.login(process.env.BOT_TOKEN);
