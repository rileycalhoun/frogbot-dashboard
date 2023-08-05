import type Channel from "../Channel";

export default interface Guild {
    id: string,
    name: string,
    icon: string,
    iconUrl: string,
    permissions: number,
    channels: Channel[],
    invite: string,
    inGuild: boolean
}