import { CommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";

export class Memory implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "메모리";
    }
    description(): string {
        return "메모리 베타 테스트";
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

        const memoryUsage = process.memoryUsage();
        interation.reply(`현재 사용 중인 힙 메모리 : ${this.formatBytes(memoryUsage.heapUsed)}` +
                ` / 전체 힙 메모리: ${this.formatBytes(memoryUsage.heapTotal)}`);
    }

    private formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log2(bytes) / 10);
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }
}

