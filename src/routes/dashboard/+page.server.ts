import type Guild from "$lib/types/guild/DiscordGuild";
import type { PageServerLoad } from "../$types";

import { redirect } from "@sveltejs/kit";
import { ORIGIN, DISCORD_BASE_URI, DISCORD_API_URI, DISCORD_BOT_TOKEN, DISCORD_BOT_ID } from "$env/static/private";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

const rest = new REST({ version: '10' })
    .setToken(DISCORD_BOT_TOKEN);

async function getGuilds(session: Session): Promise<false | Guild[]> {
    try {
        const request = await fetch(`${DISCORD_API_URI}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${session.provider_token}` }
        });

        let response = await request.json();

        let guilds = (response as Guild[])
            .filter(guild => (guild.permissions & 0x20) === 0x20);
        return guilds;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const load = (async ({ locals }) => {
    let session = await locals.getSession();
    if (!session) {
        throw redirect(302, '/');
    }

    let response: false | Guild[] = await getGuilds(session);
    if (!response) {
        throw redirect(302, '/');
    }

    let user = session.user.user_metadata;
    if (!user) {
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
            guild.invite = `${DISCORD_BASE_URI}/oauth2/authorize?client_id=${DISCORD_BOT_ID}&scope=bot&permissions=-805445695&guild_id=${encodeURIComponent(guild.id)}&disable_guild_select=true`;
        }
    }

    return {
        props: {
            guilds,
            user
        }
    }
}) satisfies PageServerLoad;