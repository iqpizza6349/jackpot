import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";
import { GameTeam } from "../database/schemas/GameTeam";
import { Player } from "../database/schemas/Player";
import { Record } from "../database/schemas/Record";

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
        ];
    }

    permission(): bigint | undefined {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }
        
        const currentGame = await this.findOpenedGame();
        if (currentGame === null) {
            // 현재 진행 중인 게임을 찾지 못함
            interation.reply({ content: "현재 진행 중인 게임을 찾지 못하였습니다.", ephemeral: true });
            return;
        }
        else if (currentGame.open === true) {
            // 배팅 중인 게임
            interation.reply({ content: "현재 배팅 중인 게임입니다. /배팅중지 로 먼저 배팅을 중지해주세요!", ephemeral: true });
            return;
        }

        const winningTeam = interation.options.get("승리한팀")?.value as string;
        const allGameTeam = await this.findAllGameTeam(currentGame._id);
        const isExists: boolean = allGameTeam.filter((g) => g.name === winningTeam).length !== 0;
        if (!isExists) {
            // '승리한팀'이 현재 게임에 존재하지 않음
            interation.reply({ content: `현재 게임에는 ${winningTeam}(팀)이 존재하지 않습니다.`, ephemeral: true });
            return;
        }

        const bettingAmount = await this.findAllPlayers(currentGame._id, winningTeam);
        await currentGame.updateOne({ finish: true });
        const bettings = bettingAmount as Map<string, number>;
        // send 'current game has finished... which team has win..?' embed message
        const allAmount = Array.from(bettings.values()).reduce((prev, cur) => {
            return Number(prev) + Number(cur);
        }, 0);
        const embed = this.createEmbed(winningTeam, allAmount);
        interation.reply({ embeds: [embed] });
    }

    private createEmbed(winningTeam: string, bettingAmount: number) {
        return new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("토토 종료")
                .setDescription("어느 팀이 승리했는 지 정보를 출력합니다.")
                .addFields(
                    { name: "우승팀", value: `${winningTeam}(팀)`, inline: true },
                    { name: "총 배팅액", value: `${bettingAmount}` },
                    { name: "\u200B", value: "\uD83C\uDF89 승리팀에 배팅한 분들 모두 축하드립니다." }
                );
    }

    private async findOpenedGame() {
        return await Game.findOne({ finish: false });
    }

    private async findAllGameTeam(gameId: any) {
        return await GameTeam.find({ game: gameId });
    }

    private async findAllPlayers(gameId: any, winningTeam: string) {
        return await Player.find().populate({
                                path: "history",
                                populate: [
                                    { path: "team" }
                                ]
                        })
                        .exec()
                        .then(async (players) => {
                            if (!players) {
                                return;
                            }

                            const bettingAmount = new Map();
                            this.calculateEachTeamBetting(gameId, players, 
                                        bettingAmount);
                            for (let player of players) {
                                const gameRecord = this.findGameRecords(gameId, player.history)[0];
                                if(gameRecord === undefined || gameRecord === null || gameRecord.index === -1) {
                                    continue;
                                }

                                const selfRecord = gameRecord.record as any;
                                const selfTeam = selfRecord.team.name;
                                if (winningTeam !== selfTeam) {
                                    await Record.updateOne(
                                        { _id: selfRecord._id },
                                        { $set: { won: false } }
                                    );
                                    continue;
                                }

                                const selfBet = selfRecord.amount;
                                const selfTeamAllBets = bettingAmount.get(selfTeam);
                                const selfStake = (selfBet / selfTeamAllBets);    // 지분율
                                let earnMoney = 0;
                                for (let other of bettingAmount.keys()) {
                                    if (other === selfTeam) {
                                        continue;
                                    }

                                    earnMoney += bettingAmount.get(other) * selfStake;
                                }
                                const amount = selfBet + earnMoney;
                                player.amount = player.amount + amount;
                                await player.save();
                                await Record.updateOne(
                                    { _id: selfRecord._id },
                                    { $set: { won: true } }
                                );
                            }
                            return bettingAmount;
                        });
    }

    private calculateEachTeamBetting(gameId: number, players, bettingAmount: Map<string, number>) {
        for (let player of players) {
            const history = player.history;
            const gameRecords = this.findGameRecords(gameId, history);
            if (gameRecords.length === 0 || gameRecords[0].index === -1) {
                // it means empty
                continue;
            }

            const playerBetting = gameRecords[0].record;
            const key = playerBetting.team.name;
            if (bettingAmount.has(key)) {
                bettingAmount.set(key, playerBetting.get(key) + playerBetting.amount);
            }
            else {
                bettingAmount.set(key, playerBetting.amount);
            }
        }
    }

    private findGameRecords(gameId: number, history: Array<any>) {
        return history.map((v, i) => {
            if (String(v.game._id) === String(gameId)) {
                return { index: i, record: v };
            }
            return { index: -1, record: {} };
        });
    }

}
