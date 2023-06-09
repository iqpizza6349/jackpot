import { CacheType, CommandInteraction } from "discord.js";
import { ICommand } from "./ICommand";

export class Ping implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "ping";
    }
    
    description(): string {
        return "현재 서버와의 연결까지 걸리는 딜레이를 조회합니다.";
    }

    options(): any[] {
        return [];
    }

    permission(): bigint | undefined {
        return undefined;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const user = interation.user;
        await interation.deferReply();
        const reply = await interation.fetchReply();
        const ping  = reply.createdTimestamp - interation.createdTimestamp;
        await interation.editReply(
            `Pong! ${user.username}이/가 채널에 접근하기 까지 걸린 시간: ${ping}ms`
        );
    }
}
