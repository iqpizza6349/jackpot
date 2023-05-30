import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";

export class Team implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "팀";
    }

    description(): string {
        return "현재 진행 중인 토토에 팀을 추가/삭제합니다.";
    }

    options(): any[] {
        return [
            {
                name: "행위",
                description: "토토에 팀을 추가합니다.",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "추가",
                        value: "add"
                    },
                    {
                        name: "삭제",
                        value: "rm"
                    }
                ],
                required: true
            },
            {
                name: "팀명",
                description: "토토에 팀을 삭제합니다.",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ];
    }

    permission(): bigint {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const method = interation.options.get("행위")?.value as string;
        // 행위가 'add'라면 팀원을 추가하고, 'rm'이라면 삭제한다.
        // TODO: if `method` is 'add', add team in game collection,
        //       if is 'rm', remove team in game collection
    }
    
}
