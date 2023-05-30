import mongoose, { Model } from "mongoose";

interface GameSchema {
    name: string,
    open: boolean,  // is game betting is stop?
    finish: boolean // is game is over(finish)
}

interface GameModel extends Model<GameSchema> {}

/**
 * Definition `game` schema to bet.
 * There's only one field, `name` (a.k.a gamename)
 */
const gameSchema = new mongoose.Schema<GameSchema, GameModel>({
    name: { type: String, required: true, unique: true },
    open: { type: Boolean, default: true },
    finish: { type: Boolean, default: false }
});

const Game = mongoose.model<GameSchema, GameModel>("Game", gameSchema);

export { Game };
