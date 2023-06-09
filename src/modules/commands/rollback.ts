import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";
import { Player } from "../database/schemas/Player";
import { Record } from "../database/schemas/Record";
import { GameTeam } from "../database/schemas/GameTeam";

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
                type: ApplicationCommandOptionType.Boolean,
                required: true
            },
        ]
    }

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const isTrue = interation.options.get("롤백여부")?.value;
        if (!isTrue) {
            await interation.reply({content: "롤백을 하지 않았습니다! \uD83D\uDE05", ephemeral: true});
            return;
        }

        await Record.deleteMany({});
        await GameTeam.deleteMany({});
        await Game.deleteMany({});
        await Player.updateMany({}, { $set: { amount: 1000, history: [] } });
        await interation.reply("롤백이 성공적으로 이루어졌습니다! \uD83D\uDE28");
    }
}
