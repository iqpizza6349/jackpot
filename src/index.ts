import { Client, GatewayIntentBits } from "discord.js";
import { config } from 'dotenv';
import { InteractionRegister } from "./modules/interactions/interactionRegister";
import { CommandRegister } from "./modules/commands/commandRegister";
import { findCommands } from "./modules/commands/commandLoader";

config();   // config '.env'

const TOKEN = process.env.BOT_TOKEN || '';
const CLIENT_ID = process.env.CLIENT_ID || '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const interactionManager = new InteractionRegister(client);

// dynamic find commands and register it
const dynamicCommands = findCommands();
const commandRegister = new CommandRegister(TOKEN, CLIENT_ID, dynamicCommands);
commandRegister.registerCommands();

// add interactions to work in bot
interactionManager.addReadyInteraction();

client.login(TOKEN);
