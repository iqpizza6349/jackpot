import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
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
        ]
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
            return;
        }

        const winningTeam = interation.options.get("승리한팀")?.value as string;
        const allGameTeam = await this.findAllGameTeam(currentGame._id);
        const isExists: boolean = allGameTeam.filter((g) => g.name ===  winningTeam).length !== 0;
        if (!isExists) {
            // '승리한팀'이 현재 게임에 존재하지 않음
            return;
        }

        // 찾고 계산하고, 처리하고 response 끝
        await this.findAllPlayers(currentGame._id, winningTeam);

        // 3. 해당 게임 종료
        interation.reply({ content: 'nothing', ephemeral: true });
    }

    private async findOpenedGame() {
        return await Game.findOne({ open: true, finish: false });
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
                            console.log(bettingAmount);
                            for (let player of players) {
                                const gameRecord = this.findGameRecords(gameId, player.history)[0];
                                if(gameRecord.index === -1) {
                                    continue;
                                }

                                // 100 + (200 * ($지분 * 0.01))
                                // 200 + (100 * ())
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
                                console.log("여기까지 닿기는 해?");
                                for (let other of bettingAmount.keys()) {
                                    if (other === selfTeam) {
                                        continue;
                                    }

                                    console.log("계산 중!");
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
                        })
                        .catch((error) => {
                            console.error(error);
                        });
    }

    private calculateEachTeamBetting(gameId: number, players, bettingAmount: Map<string, number>) {
        for (let player of players) {
            const history = player.history;
            const gameRecords = this.findGameRecords(gameId, history);
            if (gameRecords[0].index === -1) {
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
