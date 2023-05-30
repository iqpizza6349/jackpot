import { Player } from "../database/schemas/Player";

/**
 * register user when user send slash-command first time
 */
export async function register(id: number) {
    const player = await findPlayerById(id);
    if (player !== null) {
        return;
    }

    await Player.create({
        _id: id,
    });
}

async function findPlayerById(id: number) {
    return await Player.findById(id);
}

