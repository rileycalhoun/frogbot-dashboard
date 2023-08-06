import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URI } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {

    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URI,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event
    });

    await event.locals.supabase.auth.refreshSession();
    event.locals.getSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        }
    });
};