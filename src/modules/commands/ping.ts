import { ICommand } from './ICommand';

export class Ping implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "ping";
    }
    
    description(): string {
        return "현재 서버와의 연결까지 걸리는 딜레이를 조회합니다.";
    }
}
