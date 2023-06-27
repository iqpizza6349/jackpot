import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";

/**
 * 모든 플레이어들의 소지금을 rollback 합니다.
 * 이전에 진행했던, 그리고 현재 진행 중인 모든 게임을 종료 및 삭제합니다.
 * 게임 팀들을 비롯한 이록을 전부 삭제합니다.
 */
export class RollBack implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "rollback";
    }

    description(): string {
        return "모든 플레이어들의 소지금을 초기 상태로 되돌리며, 모든 토토들의 정보와 기록들을 말소시킵니다.";
    }

    options(): any[] {
        return [
            {
                name: "롤백여부",
                description: "true일 경우, 롤백을 진행합니다.",
                type: ApplicationCommandOptionType.String,
                required: true
            },
        ]
    }

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
