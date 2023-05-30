import { CommandInteraction, CacheType, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ICommand } from "./ICommand";
import { Game } from "../database/schemas/Game";
import { Player } from "../database/schemas/Player";
import { GameTeam } from "../database/schemas/GameTeam";
import { Record } from "../database/schemas/Record";

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
        const userId = Number(user.id);
        let player = await this.findPlayerById(userId);
        if (player === null) {
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
    
        const record = await Record.create({
            game: openedGame._id,
            team: team._id,
            amount: bettingAmount,
        });
        await Player.updateOne({ _id: player._id }, 
            { $push: { history: record }, amount: player.amount - bettingAmount }
        );

        player = await this.findPlayerById(userId);
        const avatar = (user.avatarURL() === null) ? undefined : user.avatarURL()?.toString();
        const embedProfile = this.createEmbed(user.username, avatar, player?.history, player?.amount);
        interation.reply({ embeds: [embedProfile] });
    }

    private async findOpenedGame() {
        return await Game.findOne({ open: true, finish: false });
    }

    private async findPlayerById(id: number) {
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

    private createEmbed(username: string, avatar?: string, history?: any[], money?: number) {
        let embed = new EmbedBuilder().setColor(0x0099FF).setTitle("토토 프로필");
        embed = this.createAuthor(embed, username, avatar)
                    .setDescription(`${username}의 소지금과 토토 내역`)
                    .addFields(
                        { name: "소지금", value: `${money}` },
                        { name: "\u200B", value: "\u200B" },
                        { name: "가장 최근 토토 플레이", value: "\u200B" }
        );
        const record = this.createGameField(history);
        for (let i = 0; i < record.length; i++) {
            embed = embed.addFields(record[i]);
        }

        return embed.setTimestamp();
    }

    private createAuthor(builder: EmbedBuilder, username: string, avatar?: string) {
        if (avatar) {
            builder.setAuthor({ name: username, iconURL: avatar });
        }
        return builder;
    }

    private createGameField(history?: any[]) {
        if (history === undefined) {
            return [];
        }
        const record = history.map((v) => {
            return { 
                name: (v.won === null) ? "아직 결과가 나오지 않았습니다." : v.won, 
                value: `${v.game.name}\n배팅한 팀: ${v.team.name}\n배팅액: ${v.amount}`,
                inline: true
            }
        }).splice(-3);
        return record;
    }
}
