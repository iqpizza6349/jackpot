import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./ICommand";

export class Rank implements ICommand {
    cmd: boolean = true;

    name(): string {
        throw new Error("Method not implemented.");
    }

    description(): string {
        throw new Error("Method not implemented.");
    }

    options(): any[] {
        throw new Error("Method not implemented.");
    }

    permission(): bigint | undefined {
        throw new Error("Method not implemented.");
    }

    action(interation: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

