import type GuildModelType from "$lib/types/guild/StoredGuild";
import mongoose from "mongoose";

const GuildSchema = new mongoose.Schema<GuildModelType>({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: false,
    },
    messageTime: {
        type: String,
        default: "10:00"
    },
    timezone: {
        type: String,
        default: "GMT-8"
    },
    channel: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: false
    }
});

export default mongoose.models.Guild 
    || mongoose.model<GuildModelType>("Guild", GuildSchema, "guilds");