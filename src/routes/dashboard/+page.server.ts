import type Guild from "$lib/types/guild/DiscordGuild";
import type { PageData, PageServerLoad } from "../$types";

import { redirect } from "@sveltejs/kit";
import { ORIGIN, DISCORD_BASE_URI, DISCORD_API_URI, DISCORD_BOT_TOKEN, DISCORD_BOT_ID, GUILD_REDIRECT_PATH } from "$env/static/private";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { Session, UserMetadata } from "@supabase/supabase-js";

const rest = new REST({ version: '10' })
    .setToken(DISCORD_BOT_TOKEN);

async function getGuilds(session: Session): Promise<false | Guild[]> {
    let {
        provider_token: access_token,
        provider_refresh_token: refresh_token
    } = session;

    if (!access_token && refresh_token) {
        const discord_request = await fetch(`${ORIGIN}/api/refresh?code=${refresh_token}`);
        const discord_response = await discord_request.json();

        session.access_token = discord_response.disco_access_token;
        session.refresh_token = discord_response.disco_refresh_token;

        if (discord_response.disco_access_token) {
            try {
                const request = await fetch(`${DISCORD_API_URI}/users/@me/guilds`, {
                    headers: { Authorization: `Bearer ${discord_response.disco_access_token}` }
                });

                let response = await request.json();
                if (!response || !response.ok) {
                    return false;
                }

                const guilds = (response as Guild[])
                    .filter(guild => (guild.permissions & 0x20) === 0x20);
                return guilds;
            } catch (error) {
                console.error('Error fetching guilds with new access token:', error);
            }
        }
    } else if (access_token) {
        try {
            const request = await fetch(`${DISCORD_API_URI}/users/@me/guilds`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            let response = await request.json();

            let guilds = (response as Guild[])
                .filter(guild => (guild.permissions & 0x20) === 0x20);
            return guilds;
        } catch (error) {
            console.error('Error fetching guilds with access token: ', error);
        }
    } else {
        throw redirect(302, '/api/signout');
    }

    return false;
}

export const load = (async ({ locals, cookies }) => {
    let session = await locals.getSession();
    if (!session) {
        throw redirect(302, '/');
    }

    let response: false | Guild[] = await getGuilds(session);
    if (!response) {
        throw redirect(302, '/');
    }

    let user = session.user.user_metadata;
    if(!user) {
        throw redirect(302, '/');
    }

    let guilds: Guild[] = response as Guild[];
    if (guilds.length === 0) {
        return {
            props: {
                guilds,
                user
            }
        }
    }

    // Set properties in each guild
    for (let guild of guilds) {
        const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
        guild.iconUrl = iconUrl;

        try {
            await rest.get(Routes.guildMember(guild.id, DISCORD_BOT_ID));
            guild.inGuild = true;
        } catch (err) {
            guild.inGuild = false;
            guild.invite = `${DISCORD_BASE_URI}/oauth2/authorize?client_id=${DISCORD_BOT_ID}&scope=bot&permissions=-805445695&guild_id=${encodeURIComponent(guild.id)}&disable_guild_select=true&redirect_uri=${encodeURIComponent(`${ORIGIN}/dashboard`)}`;
        }
    }

    return {
        props: {
            guilds,
            user
        }
    }
}) satisfies PageServerLoad;