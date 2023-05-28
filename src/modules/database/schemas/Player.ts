import mongoose, { Model } from "mongoose";

interface PlayerSchema {
    _id: number,
    amount: number,
    history: []
}

interface PlayerModel extends Model<PlayerSchema> {}

/**
 * Definition `player` schema to bet `team` schema.
 * player has `amount`(current money), `history`(betting history).
 */
const playerSchema = new mongoose.Schema<PlayerSchema, PlayerModel>({
    _id: { type: Number, required: true },
    amount: { type: Number, required: true, default: 1000 },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }]
});
const Player = mongoose.model<PlayerSchema, PlayerModel>("Player", playerSchema);

export { Player };
