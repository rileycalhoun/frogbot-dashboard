import type { PageServerLoad } from './$types';
import { ORIGIN, DISCORD_REDIRECT_PATH } from '$env/static/private';

const days = ['Sunday', 'Monday', 'Tuesday',
	'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const redirect_uri = `${ORIGIN}${DISCORD_REDIRECT_PATH}`;

export const load: PageServerLoad = async ({ locals }) => {
	let todayPST = new Date().toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles'
	});

	let index = new Date(todayPST).getDay();
	let day = days[index as unknown as number];

	return {
		props: {
			day: {
				name: day,
				index
			},
			redirect_uri
		}
	};
};
