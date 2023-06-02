import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";

export class Victory implements ICommand {
    cmd: boolean = true;
    
    name(): string {
        return "승리";
    }

    description(): string {
        return "토토판의 승리팀을 정하여, 판을 종료합니다. 관리자 이외에는 사용할 수 없습니다.";
    }

    options(): any[] {
        return [
            {
                name: "승리한팀",
                description: "승리한 팀을 정해주세요.",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

