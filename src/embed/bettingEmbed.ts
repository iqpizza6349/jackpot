import { EmbedBuilder } from "discord.js";

export function createEmbed(username: string, avatar?: string, history?: any[], 
            money?: number) {
    const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("토토 프로필")
                    .setAuthor({ name: username, iconURL: avatar })
                    .setDescription(`${username}의 소지금과 토토 내역`)
                    .addFields(
                        { name: "소지금", value: `${money}` },
                        { name: "\u200B", value: "\u200B" },
                        { name: "가장 최근 토토 플레이", value: "\u200B" }
                    );

    const record = createGameField(history);
    for (let i = 0; i < record.length; i++) {
        embed.addFields(record[i]);
    }

    return embed.setTimestamp();
}

function createGameField(history?: any[]) {
    if (history === undefined) {
        return [];
    }
    const record = history.map((v) => {
        return { 
            name: (v.won === null) ? "아직 결과가 나오지 않았습니다." : gameResult(v.won),
            value: `${v.game.name}\n배팅한 팀: ${v.team.name}\n배팅액: ${v.amount}`,
            inline: true
        }
    }).splice(-3);
    return record;
}

function gameResult(isWon: boolean): string {
    return (isWon) ? "경기 승리" : "경기 패배";
}
