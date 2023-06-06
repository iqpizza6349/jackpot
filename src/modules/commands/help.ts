import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./ICommand";

export class Help implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "help";
    }

    description(): string {
        return "토토 관리자 혹은 플레이어의 도움을 주기 위한 명령어입니다.";
    }

    options(): any[] {
        return [];
    }

    permission(): bigint | undefined {
        return undefined;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
