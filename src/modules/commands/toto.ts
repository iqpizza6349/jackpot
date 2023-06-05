import { CommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";
import { Record } from "../database/schemas/Record";
import { Player } from "../database/schemas/Player";
import { GameTeam } from "../database/schemas/GameTeam";

export class TOTO implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "토토정보";
    }

    description(): string {
        return "현재 진행 중인 토토의 배팅액, 경기팀과 같은 정보를 조회합니다.";
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

        const currentGame = await this.findUnfinishedGame();
        if (currentGame === null) {
            return;
        }

        const gameId = currentGame._id;
        const records = await this.findRecordsByGame(gameId);
        const allAmount = records.reduce((prev: any, current: any) => {
            return prev.amount + current.amount;
        }, { amount: 0 });
        const bettingAmount = new Map();
        const players = await this.findAllPlayers();
        this.calculateEachTeamBetting(String(gameId), players, bettingAmount);
        const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle("토토 정보")
                        .setDescription("현재 진행 중인 토토의 정보를 조회합니다.")
                        .addFields({ name: "토토명", value: currentGame.name })
                        .addFields({ name: "총 배팅액", value: String(allAmount) })
                        .addFields({ name: "\u200B", value: "경기팀" });
        let teams = await this.findAllTeamByGame(gameId);
        teams = teams.filter((v) => {
            for (const team of bettingAmount.keys()) {
                if (String(team) === String(v.name)) {
                    continue;
                }
            }
            return !Array.from(bettingAmount.keys())
                        .includes(v.name);
        });
        for (const team of bettingAmount.keys()) {
            embed.addFields(
                {
                    name: `${team}(팀)`,
                    value: `배팅된 금액: ${bettingAmount.get(team)}`,
                    inline: true
                }
            );
        }
        for (const team of teams) {
            embed.addFields(
                {
                    name: `${team.name}(팀)`,
                    value: "배팅된 금액: 0",
                    inline: true
                }
            );
        }
        embed.setTimestamp();

        interation.reply({ embeds: [ embed ] });
    }

    private async findUnfinishedGame() {
        return await Game.findOne({ finish: false });
    }

    private async findAllTeamByGame(game: any) {
        return await GameTeam.find({ game });
    }

    private async findRecordsByGame(game: any) {
        return await Record.find({})
                .populate("game")
                .exec()
                .then((documents) => {
                    if (documents.length === 0) {
                        return [];
                    }

                    return documents.filter((v) => {
                        return String(v.game._id) === String(game)
                    });
                });
    }

    private async findAllPlayers() {
        return await Player.find().populate({
            path: "history",
            populate: [
                { path: "game" },
                { path: "team" }
            ]
        });
    }

    private calculateEachTeamBetting(gameId: string, players, bettingAmount: Map<string, number>) {
        for (let player of players) {
            const history = player.history;
            const gameRecords = this.findGameRecords(gameId, history)
                        .filter((v) => {
                    return v.index !== -1
            });
            if (gameRecords.length === 0) {
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

    private findGameRecords(gameId: string, history: Array<any>) {
        return history.map((v, i) => {
            if (String(v.game._id) === gameId) {
                return { index: i, record: v };
            }
            return { index: -1, record: {} };
        });
    }
}
