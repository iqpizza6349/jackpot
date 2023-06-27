import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./ICommand";

/**
 * 모든 플레이어들의 소지금을 rollback 합니다.
 * 이전에 진행했던, 그리고 현재 진행 중인 모든 게임을 종료 및 삭제합니다.
 * 게임 팀들을 비롯한 이록을 전부 삭제합니다.
 */
export class RollBack implements ICommand {
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

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
