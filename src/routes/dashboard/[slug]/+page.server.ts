import type Guild from "$lib/types/guild/DiscordGuild";
import type Channel from "$lib/types/Channel";
import type Parameters from "$lib/types/Parameters";
import type { PageServerLoad, Actions } from "./$types";

import Guilds from "$lib/mongo/models/Guild";
import { DISCORD_BOT_TOKEN, DISCORD_BOT_ID } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { connect, disconnect } from '$lib/mongo/db';

const rest = new REST({ version: '10' })
    .setToken(DISCORD_BOT_TOKEN);

export const load = (async ({ params }) => {
    await connect();
    const { slug: id } = params as Parameters;

    // Check if the bot is in the guild
    let channels: Channel[];
    try {
        let guild = await rest.get(Routes.guild(id)) as Guild;
        let guildChannels = await rest.get(Routes.guildChannels(id)) as Channel[];

        if (!(await Guilds.exists({ id }))) {
            await Guilds.create({
                id,
                name: guild.name,
                nickname: '',
                icon: guild.icon,
                messageTime: "10:00",
                timezone: "GMT-8",
                channel: guildChannels.filter(channel => channel.type === 0)[0].id
            });
        }

        channels = await rest.get(Routes.guildChannels(id)) as Channel[];
        channels = channels.filter(channel => channel.type === 0);
    } catch (error) {
        console.log(`Error fetching guild: ${error}`);
        // If not, redirect to dashboard
        throw redirect(302, '/dashboard');
    }

    await connect();
    let storedGuild = await Guilds.findOne({ id });
    
    await disconnect();
    return {
        props: {
            channels,
            name: storedGuild.name,
            nickname: storedGuild.nickname,
            messageTime: storedGuild.messageTime,
            timezone: storedGuild.timezone,
            channel: storedGuild.channel
        }
    }
}) satisfies PageServerLoad;

export const actions = {
    changeNickname: async ({ request, params, locals }) => {
        await connect();

        const { slug: id } = params as Parameters;
        try {
            await rest.get(Routes.guild(id));
        } catch (error) {
            await disconnect();

            console.log('Bot is not in this guild.');
            return {
                success: false,
                message: 'Bot is not in this guild.'
            }
        }

        const data = await request.formData();
        const nickname = data.get('nickname') as string;
        if (!nickname) {
            await disconnect();

            console.log('No nickname provided.');
            return {
                success: false,
                message: 'No nickname provided.'
            }
        }

        try {
            await Guilds.findOneAndUpdate({ id }, {
                $set: {
                    nickname
                }
            }).exec();

            rest.put(Routes.guildMember(id, DISCORD_BOT_ID), {
                reason: 'Changing nickname',
                body: {
                    nick: nickname
                }                   
            });
        } catch (error) {
            await disconnect();

            console.log(`Error changing nickname: ${error}`);
            return {
                success: false,
                message: 'Error changing nickname.'
            }
        }

        await disconnect();
        return {
            success: true
        }
    },
    changeMessageTime: async ({ request, params, locals }) => {
        await connect();

        const { slug: id } = params as Parameters;
        try {
            await rest.get(Routes.guild(id));
        } catch (error) {
            await disconnect();

            console.log('Bot is not in this guild.');
            return {
                success: false,
                message: 'Bot is not in this guild.'
            }
        }

        const data = await request.formData();

        const time = data.get('time') as string;
        const timezone = data.get('timezone') as string;

        if (!time) {
            await disconnect();

            console.log('No message time provided.');
            return {
                success: false,
                message: 'No message time provided.'
            }
        }

        if (!timezone) {
            await disconnect();

            console.log('No timezone provided.');
            return {
                success: false,
                message: 'No timezone provided.'
            }
        }

        try {

            await Guilds.findOneAndUpdate({ id }, {
                $set: {
                    messageTime: time,
                    timezone
                }
            }).exec();

        } catch (error) {
            await disconnect();

            console.log(`Error changing message time: ${error}`);
            return {
                success: false,
                message: 'Error changing message time.'
            }
        }
    },
    changeChannel: async ({ request, params, locals }) => {
        await connect();

        const { slug: id } = params as Parameters;
        try {
            await rest.get(Routes.guild(id));
        }
        catch (error) {
            await disconnect();

            console.log('Bot is not in this guild.');
            return {
                success: false,
                message: 'Bot is not in this guild.'
            }
        }

        const data = await request.formData();
        const channel = data.get('channels') as string;
        if (!channel) {
            await disconnect();

            console.log('No channel provided.');
            return {
                success: false,
                message: 'No channel provided.'
            }
        }

        try {

            await Guilds.findOneAndUpdate({ id }, {
                $set: {
                    channel
                }
            }).exec();

        } catch (error) {
            await disconnect();

            console.log(`Error changing channel: ${error}`);
            return {
                success: false,
                message: 'Error changing channel.'
            }
        }
    }
} satisfies Actions;