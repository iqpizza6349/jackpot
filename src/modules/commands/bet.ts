import { CommandInteraction, CacheType, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";
import { Player } from "../database/schemas/Player";
import { GameTeam } from "../database/schemas/GameTeam";
import { Record } from "../database/schemas/Record";
import { createEmbed } from "../../embed/bettingEmbed";

export class Bet implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "배팅";
    }

    description(): string {
        return "현재 진행 중인 토토에 배팅합니다.";
    }

    options(): any[] {
        return [
            {
                name: "배팅할팀",
                description: "배팅할 토토 팀을 설정합니다.",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "배팅액",
                description: "현재 소지금에 한해서 배팅합니다.",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 10,
                max_value: 1000
            }
        ];
    }

    permission(): bigint | undefined {
        return undefined;
    }
    
    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const openedGame = await this.findOpenedGame();
        if (openedGame === null) {
            await interation.reply(
                { 
                    content: "현재 개장된 토토가 없거나 더 이상 배팅을 받고 있는 토토가 없습니다.", 
                    ephemeral: true 
                }
            );
            return;
        }

        const user = interation.user;
        const userId = user.id;
        let player = await this.findPlayerById(userId);
        if (player === null) {
            // it could be not happen
            await interation.reply(`<@${userId}> 당신 누구야. 등록 안하고 어떻게 명령했어`);
            return;
        }

        const bettingAmount = interation.options.get("배팅액")?.value as number;
        if (player.amount < bettingAmount) {
            await interation.reply({ content: `소지금이 모자랍니다.\n현재 소지금: ${player.amount}`, ephemeral: true });
            return;
        }

        const target = interation.options.get("배팅할팀")?.value as string;
        const team = await this.findTeamByName(openedGame._id, target);
        if (team === null) {
            await interation.reply({ content: "존재하지 않는 팀입니다.", ephemeral: true });
            return;
        }

        let record = await this.findBettingRecord(player._id, openedGame._id);
        if (record.length !== 0) {
            record = record[0];
            const previousTeam = record.team.name;
            const previousAmount = record.amount;
            await record.updateOne({ team: team._id, amount: bettingAmount });
            await player.updateOne({ amount: record.amount + player.amount - bettingAmount });
            await interation.reply(
                {
                    content: `배팅을 ${previousTeam}, ${previousAmount}원 -> ${team.name}, ${bettingAmount}원으로 변경하셨습니다.`,
                    ephemeral: true
                }
            );
        }
        else {
            await team.updateOne({ count: team.count + 1 });
            record = await Record.create({
                game: openedGame._id,
                team: team._id,
                amount: bettingAmount,
            });
            await Player.updateOne({ _id: player._id }, 
                { $push: { history: record }, amount: player.amount - bettingAmount }
            );
        }

        player = await this.findPlayerById(userId);
        const avatar = (user.avatarURL() === null) ? undefined : user.avatarURL()?.toString();
        const embedProfile = createEmbed(user.username, avatar, player?.history, player?.amount);
        if (interation.replied) {
            await interation.channel?.send({ embeds: [embedProfile] });
        }
        else {
            await interation.reply({ embeds: [embedProfile] });
        }
    }

    private async findOpenedGame() {
        return await Game.findOne({ open: true, finish: false });
    }

    private async findPlayerById(id: string) {
        return await Player.findById(id).populate({
            path: "history",
            populate: [
                { path: "game" },
                { path: "team" },
            ],
        });
    }

    private async findTeamByName(id: any, name: string) {
        return await GameTeam.findOne({ game: id, name });
    }

    private async findBettingRecord(playerId: string, gameId: any): Promise<any> {
        return await Player.findById(playerId).populate({
            path: "history",
            populate: [
                { path: "game" },
                { path: "team" }
            ]
        }).exec()
        .then((documents) => {
            if (documents === null) {
                return [];
            }

            return documents.history.filter((v: any) => {
                return String(v.game._id) === String(gameId);
            });
        })
    }
}
