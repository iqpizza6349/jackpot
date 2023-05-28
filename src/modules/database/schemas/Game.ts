import mongoose, { Model } from "mongoose";

interface GameSchema {
    name: string
}

interface GameModel extends Model<GameSchema> {}

/**
 * Definition `game` schema to bet.
 * There's only one field, `name` (a.k.a gamename)
 */
const gameSchema = new mongoose.Schema<GameSchema, GameModel>({
    name: { type: String, required: true }
});

const Game = mongoose.model<GameSchema, GameModel>("Game", gameSchema);

export { Game };