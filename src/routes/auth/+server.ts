import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, url }) => {
    let { searchParams } = url;
    let type = searchParams.get('type');

    if (type === 'login') {
        const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
            provider: 'discord'
        });

        if (err) {
            console.error(err);
            return new Response(null, {
                status: 500,
                statusText: 'Internal Server Error'
            });
        }

        throw redirect(302, data.url);
    } else if (type === 'logout') {
        const { error: err } = await locals.supabase.auth.signOut();
        if(err) {
            console.error(err);
            return new Response(null, {
                status: 500,
                statusText: 'Internal Server Error'
            });
        }

        throw redirect(302, '/');
    }
}