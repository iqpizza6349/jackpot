import { CommandInteraction, CacheType, EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { ICommand } from "./ICommand";
import { findDynamicCommands } from "./commandLoader";

export class Help implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "help";
    }

    description(): string {
        return "토토 관리자 혹은 플레이어의 도움을 주기 위한 명령어입니다.";
    }

    options(): any[] {
        return [
            {
                name: "권한",
                description: "true인 경우, 관리자가 사용 가능한 명령어들만 조회합니다." 
                            + " false인 경우, 플레이어가 사용 가능한 명령어듦나 조회합니다.",
                type: ApplicationCommandOptionType.Boolean
            }
        ];
    }

    permission(): bigint | undefined {
        return undefined;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }
        const commands = findDynamicCommands();
        const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle("토토 명령어 도움말")
                        .setDescription("토토 관리자 혹은 플레이어의 명령어 도움말입니다.");
        const option = interation.options.get("권한");
        let isAdmin = -1;
        if (option !== null) {
            isAdmin = (option?.value as boolean) ? 1 : 0;
        }

        for (const cmd of commands) {
            if (isAdmin === 1) {
                // 관리자만 찾기로 했을 때
                if (cmd.permission() === undefined) {
                    // 그런데 권한이 없다고 하면 무시
                    continue;
                }
            }
            else if (isAdmin === 0){
                if (cmd.permission() !== undefined) {
                    continue;
                }
            }
            
            embed.addFields({
                name: cmd.name(),
                value: cmd.description(),
                inline: true
            });
        }
        interation.reply({ embeds: [embed] });
    }
}
