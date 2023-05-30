import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";

export class PlayGame implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "토토개장";
    }

    description(): string {
        return "토토 판을 개장합니다. 관리자 이외에는 사용할 수 없습니다.";
    }

    options(): any[] {
        return [
            {
                name: "토토명",
                description: "개장할 토토의 이름을 작성하세요",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ];
    }

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }
        
        const gameName = interation.options.get("토토명")?.value as string;
        const isExists = await this.existsGame(gameName);
        if (!isExists) {
            await interation.reply({ content: "해당 토토명으로 이미 개장되었습니다.", ephemeral: true });
            return;
        }
        
        const hasOpenedGame = await this.existsCurrentGame();
        if (!hasOpenedGame) {
            await interation.reply({ content: "개장되어 진행 중인 게임이 이미 있습니다.", ephemeral: true });
            return;
        }

        await Game.create({
            name: gameName
        });
        await interation.channel?.send(`@everyone \`${gameName}\` 토토판이 개장되었습니다!`);
        await interation.reply({ content: this.messageFormat(gameName), ephemeral: true });
    }

    async existsGame(gameName: string): Promise<boolean> {
        const game = await Game.find({ name: gameName });
        return (game.length === 0);
    }

    async existsCurrentGame(): Promise<boolean> {
        const game = await Game.find({ finish: false });
        return (game.length === 0);     // if length is 0, means there is no currently opened game
    }

    private messageFormat(gameName: string): string {
        return `토토 \`${gameName}\`판이 개장되었습니다!`;
    }
}
