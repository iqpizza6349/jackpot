import { CacheType, CommandInteraction } from "discord.js";

export interface ICommand {
    cmd: boolean;
    name(): string;
    description(): string;
    options(): any[];
    permissions(): bigint[];
    action(interation: CommandInteraction<CacheType>): Promise<void>;
}
