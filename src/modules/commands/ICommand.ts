import { CacheType, CommandInteraction } from "discord.js";

export interface ICommand {
    cmd: boolean;
    name(): string;
    description(): string;
    options(): any[];
    action(interation: CommandInteraction<CacheType>): Promise<void>;
}
