import { CommandInteraction, CacheType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand } from "./ICommand";
import { GameTeam } from "../database/schemas/GameTeam";
import { Game } from "../database/schemas/Game";

export class Team implements ICommand {
    cmd: boolean = true;
    name(): string {
        return "팀";
    }

    description(): string {
        return "현재 진행 중인 토토에 팀을 추가/삭제합니다.";
    }

    options(): any[] {
        return [
            {
                name: "행위",
                description: "토토에 팀을 추가합니다.",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "추가",
                        value: "add"
                    },
                    {
                        name: "삭제",
                        value: "rm"
                    }
                ],
                required: true
            },
            {
                name: "팀명",
                description: "토토에 팀을 삭제합니다.",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ];
    }

    permission(): bigint {
        return PermissionFlagsBits.Administrator;
    }

    async action(interation: CommandInteraction<CacheType>): Promise<void> {
        if (interation.commandName !== this.name()) {
            return;
        }

        const method = interation.options.get("행위")?.value as string;
        const teamName = interation.options.get("팀명")?.value as string;
        const currentGame = await this.findCurrentOpenedGame();
        if (currentGame === null) {
            interation.reply({ content: "현재 개장된 토토가 없습니다.", ephemeral: true });
            return;
        }
        
        const result = await this.team(method, teamName, currentGame);
        if (method === "rm") {
            const content = (result) ? `${teamName}(팀)을 토토에서 삭제하였습니다.` : `삭제할 팀을 찾지 못하였습니다.`;
            interation.reply({ content, ephemeral: true });
        }
        else {
            const content = (result) ? `${teamName}(팀)을 토토에 추가하였습니다.` : `${teamName}은 이미 존재합니다.`;
            interation.reply({ content, ephemeral: true });
        }
    }

    private async team(method: string, teamName: string, currentGame: any)
                : Promise<boolean> {
        // add or remove, whatever we do. we must check if game must not have
        // duplicated name of teams
        const team = await this.findTeamByName(currentGame._id, teamName);
        if (method === "rm") {
            if (team === null) {
                return false;
            }
            
            await GameTeam.deleteOne({ game: team?.game, name: team?.name });
            return true;
        }
        else {
            // if `method` is add
            if (team !== null) {
                return false;
            }

            await GameTeam.create({
                name: teamName,
                game: currentGame._id
            });
            return true;
        }
    }

    private async findCurrentOpenedGame() {
        const game = await Game.find({ open: true });
        return (game.length === 0) ? null : game[0];
    }

    private async findTeamByName(id: any, name: string) {
        return await GameTeam.findOne({ game: id, name });
    }
}
