import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./ICommand";

export class TOTO implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "토토정보";
    }

    description(): string {
        return "현재 진행 중인 토토의 배팅액, 경기팀과 같은 정보를 조회합니다.";
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

