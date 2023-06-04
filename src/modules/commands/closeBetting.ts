import { CommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";

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

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const currentGame = await this.findOpenedGame();
        if (currentGame === null) {
            interation.reply({ content: "현재 진행 중인 게임을 찾지 못하였습니다.", ephemeral: true });
            return;
        }
        else if (currentGame.open === false) {
            interation.reply({ content: "이미 배팅이 중지되었습니다.", ephemeral: true });
            return;
        }

        currentGame.open = false;
        currentGame.save();
        await interation.channel?.send(`@everyone \`${currentGame?.name}\` 토토판은 베팅이 종료되었습니다.\n더 이상 배팅할 수 없습니다.`);
        await interation.reply({ content: "배팅을 더 이상 할 수 없게 하였습니다.", ephemeral: true });
    }

    private async findOpenedGame() {
        return await Game.findOne({ finish: false });
    }
}
