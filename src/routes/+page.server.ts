import type { PageServerLoad } from './$types';
import { HOST, DISCORD_API_URI, DISCORD_BOT_ID, DISCORD_REDIRECT_PATH } from "$env/static/private";
import { redirect } from '@sveltejs/kit';

const days = ['Sunday', 'Monday', 'Tuesday', 
	'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const load: PageServerLoad = async ({ locals }) => {
	let index = new Date().getDay();
	let day = days[index];

	return {
		props: {
			day: {
				name: day,
				index
			}
		}
	};
};
