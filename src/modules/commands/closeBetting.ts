import { CommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";

export class CloseBetting implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "배팅중지";
    }

    description(): string {
        return "현재 개장 중인 토토에 더 이상 배팅하지 못하도록 합니다.";
    }

    options(): any[] {
        return [];
    }

    permission(): bigint {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        return;
    }
}
