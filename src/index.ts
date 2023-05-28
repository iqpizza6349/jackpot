import { Client, GatewayIntentBits } from "discord.js";
import { config } from 'dotenv';
import { InteractionRegister } from "./modules/interactions/interactionRegister";
import { CommandRegister } from "./modules/commands/commandRegister";
import { findCommands, findDynamicCommands } from "./modules/commands/commandLoader";
import { connect } from "./modules/database";

config();   // config '.env'

const TOKEN = process.env.BOT_TOKEN || '';
const CLIENT_ID = process.env.CLIENT_ID || '';

const USERNAME = process.env.DATABASE_USERNAME || '';
const PASSWORD = process.env.DATABASE_PASSWORD || '';
const HOSTNAME = process.env.DATABASE_HOSTNAME || '';
const OPTIONS  = process.env.DATABASE_OPTION   || '';

// connect and define documents
connect(USERNAME, PASSWORD, HOSTNAME, OPTIONS);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const interactionManager = new InteractionRegister(client);

// dynamic find commands and register it
const dynamicCommands = findDynamicCommands();
const commandList = findCommands();
const commandRegister = new CommandRegister(TOKEN, CLIENT_ID, commandList);
commandRegister.registerCommands();

// add interactions to work in bot
interactionManager.addReadyInteraction();

// add commands to interaction action
interactionManager.addSlashCommands(dynamicCommands);

client.login(TOKEN);
