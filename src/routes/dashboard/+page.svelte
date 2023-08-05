<script lang="ts">
	import type Guild from '$lib/types/guild/DiscordGuild';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	const { props } = data;
	const { user, guilds } = props;

	// split guilds into two lists: one containing guilds the bot is in,
	// the other containing guilds the bot is not in
	const [botGuilds, nonBotGuilds] = guilds.reduce(
		([botGuilds, nonBotGuilds], guild) => {
			if (guild.inGuild) {
				botGuilds.push(guild);
			} else {
				nonBotGuilds.push(guild);
			}
			return [botGuilds, nonBotGuilds];
		},
		[[], []] as [Guild[], Guild[]]
	);

	function getAltName(guild: Guild) {
		// Get the first letter of each word in the guild name
		const words = guild.name.split(' ');
		const letters = words.map((word) => word[0]);
		return letters.join('');
	}
</script>

<main>
	<div class="container">
		<div class="top-left-corner">
			<p class="username">Logged in as {user.full_name}</p>
			<p class="server-count">You are in {guilds.length} servers!</p>
			<p class="server-count">I am in {botGuilds.length} of them!</p>	
			<button id="signout" on:click={() => (window.location.href = '/api/signout')}>Sign out</button>
		</div>

		<h1>Dashboard</h1>
		<h2>Servers</h2>
		<ul class="server-list">
			{#each botGuilds as guild}
				<li class="server-item">
					<a class="server-link" href={`/dashboard/${guild.id}`}>
						<img class="{`${guild.icon === null ? 'server-text' : 'server-icon'}`}" src={guild.iconUrl} alt={getAltName(guild)} />
					</a>
				</li>
			{/each}
			{#each nonBotGuilds as guild}
				<li class="server-item gray-out">
					<a class="server-link" href={guild.invite}>
						<img class="{`${guild.icon === null ? 'server-text' : 'server-icon'}`}" src={guild.iconUrl} alt={getAltName(guild)} />
					</a>
				</li>
			{/each}
		</ul>
	</div>
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 50px;
		color: #333;
		font-family: 'Roboto', sans-serif;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		color: #ffffff;
		position: relative;
	}

	.top-left-corner {
		position: absolute;
		top: 20px;
		left: 20px;
	}

	button {
		background-color: #5865f2; /* Discord Blurple */
		color: #ffffff; /* white text for contrast */
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button#signout {
		margin-top: 30px;
	}

	button:hover {
		background-color: #485ebe; /* slightly darker on hover */
	}

	h1 {
		font-size: 36px;
		margin-bottom: 20px;
	}

	h2 {
		font-size: 28px;
		margin-top: 30px;
		margin-bottom: 20px;
	}

	h1,
	h2 {
		font-weight: 600; /* make them a bit bolder */
		display: flex;
		justify-content: center;
	}

	.username {
		font-weight: bold;
		font-size: 20px;
		margin-bottom: 5px;
	}

	.server-count {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	.server-list {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 20px;
	}

	.server-item {
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease-in-out;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.server-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;
	}

	.server-icon,
	.server-text {
		width: 64px;
		height: 64px;
		border-radius: 50%;
	}

	.server-icon {
		margin-right: 10px;
	}

	.server-text {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f0f0f0;
		margin-right: 10px;
		color: #333;
	}

	.server-item:hover {
		background-color: #f7f7f7;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.server-link:hover {
		text-decoration: none;
	}

	.gray-out {
		opacity: 0.5; /* Reducing opacity to give grayed-out effect */
	}
</style>
