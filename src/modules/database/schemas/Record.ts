import mongoose, { Model } from "mongoose";

interface RecordSchema {
    game: any,
    team: any,
    amount: number
}

interface RecordModel extends Model<RecordSchema> {}

/**
 * Definition `record` schema to record of gambling history
 * saves `gamename`, `team`(which bets), `amount`(how much did bet)
 */
const recordSchema = new mongoose.Schema<RecordSchema, RecordModel>({
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    amount: { type: Number, required: true }
});
const Record = mongoose.model<RecordSchema, RecordModel>("Record", recordSchema);

export { Record };
