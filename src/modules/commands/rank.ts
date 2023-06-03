import { CommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { ICommand } from "./ICommand";
import { Player } from "../database/schemas/Player";

/**
 * 전체 플레이어의 소지금을 내림차순으로 정렬하여, 순위를 10위까지
 * 계산하여 출력.
 * 본인의 순위는 임베드(embed)기준, footer 위치에 출력
 */
export class Rank implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "랭킹";
    }

    description(): string {
        return "전체 플레이어의 소지금 순위 및 본인 순위";
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
        
        const rankers = await this.findTop10Players();
        const self = await Player.findById(interation.user.id)
        const selfRank = await this.selfRank(self?.amount as number);

        const embed = new EmbedBuilder().setColor(0x0099FF)
                        .setTitle("토토 랭킹")
                        .setDescription("모든 플레이어별 소지금 랭킹")
                        .addFields(this.addRankers(rankers))
                        .setFooter({
                            text: `${interation.user.username}님은 ${selfRank + 1}위입니다.`
                        });
        interation.reply({ embeds: [embed] });
    }

    private async findTop10Players(): Promise<any[]> {
        return await Player.find({}).sort({ amount: -1 }).limit(10);
    }

    private async selfRank(selfScore: number) {
        return await Player.count({ amount: { $gt: selfScore }})
                            .sort({ amount: -1 });
    }

    private addRankers(rankers: any[]) {
        return rankers.map((v, i) => {
            return { 
                name: `${i + 1}위`,
                value: `<@${v._id}>`
            };
        });
    }
}
