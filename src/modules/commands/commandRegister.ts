import { REST, Routes } from "discord.js";
import { Command } from "./Command";
import { findInterfaceHeritors } from "../reflections/inheritorReflector";
import { ICommand } from './ICommand';

export class CommandRegister {
    private commands: Command[] = [];
    private rest: REST;

    constructor(token: string) {
        this.rest = new REST({ version: '10' }).setToken(token);
    }
    
}
