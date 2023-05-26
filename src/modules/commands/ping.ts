import { REST, Routes } from 'discord.js';
import { ICommand } from './ICommand';
import { Cmd } from './decorator/cmd';

@Cmd
export class Ping implements ICommand {

    name(): string {
        return "ping";
    }
    
    description(): string {
        return "현재 서버와의 연결까지 걸리는 딜레이를 조회합니다.";
    }
}
