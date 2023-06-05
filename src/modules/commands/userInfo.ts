import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./ICommand";
import { Player } from "../database/schemas/Player";
import { createEmbed } from "../../embed/bettingEmbed";

export class UserInfo implements ICommand {
    cmd: boolean = true;

    name(): string {
        return "프로필";
    }

    description(): string {
        return "사용자의 프로필을 조회합니다.";
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

        const user = interation.user;
        const player = await this.findPlayerById(user.id);
        const avatar = (user.avatarURL() === null) ? undefined : user.avatarURL()?.toString();
        const embedProfile = createEmbed(user.username, avatar, player?.history, player?.amount);
        await interation.reply({ embeds: [embedProfile] });
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
}
