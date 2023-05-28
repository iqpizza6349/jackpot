import { CacheType, CommandInteraction } from 'discord.js';
import { ICommand } from './ICommand';

export class Ping implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "ping";
    }
    
    description(): string {
        return "현재 서버와의 연결까지 걸리는 딜레이를 조회합니다.";
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName === this.name()) {
            await interation.reply('Pong!');
        }
    }
}
