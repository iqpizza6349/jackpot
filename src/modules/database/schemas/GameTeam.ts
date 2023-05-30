import mongoose, { Model } from "mongoose";

interface TeamSchema {
    name: string,
    game: any
}

interface TeamModel extends Model<TeamSchema> {}

/**
 * Definition `team` schema to each team collections are belonging `game` schema.
 * It means 1 game collection can have many(`N`) team collections.
 * If client wants to bet in game, the real bet is team bet not a game bet.
 */
const teamSchema = new mongoose.Schema<TeamSchema, TeamModel>({
    name: { type: String, required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true }
});
const GameTeam = mongoose.model<TeamSchema, TeamModel>("Team", teamSchema);

export { GameTeam }
