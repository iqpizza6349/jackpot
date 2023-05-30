import { CacheType, CommandInteraction } from "discord.js";

export interface ICommand {
    cmd: boolean;
    name(): string;
    description(): string;
    options(): any[];
    permission(): bigint;
    action(interation: CommandInteraction<CacheType>): Promise<void>;
}
