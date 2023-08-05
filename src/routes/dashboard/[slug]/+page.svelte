<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { props } = data;

	let { name, channels, nickname, timezone, messageTime, channel } = props;
</script>

<main>
	<button
		id="back"
		on:click={() => {
			window.location.href = '/dashboard';
		}}
	>Back</button>
	<h1>{name}'s Dashboard</h1>
	<br />
	<form id="change-nickname-form" method="POST" action="?/changeNickname">
		<label for="nickname">Nickname</label>
		<input type="text" id="nickname" name="nickname" placeholder="None" bind:value={nickname} />
		<button type="submit">Change Nickname</button>
	</form>
	<form id="change-time-form" method="POST" action="?/changeMessageTime">
		<label for="time">Message Time</label>
		<input type="time" id="time" name="time" bind:value={messageTime} />
		<label for="timezone">Timezone</label>
		<select id="timezone" name="timezone" bind:value={timezone}>
			<option value="GMT-12">DST</option>
			<option value="GMT-11">SST</option>
			<option value="GMT-10">HST</option>
			<option value="GMT-9">AKST</option>
			<option value="GMT-8">PST</option>
			<option value="GMT-7">MST</option>
			<option value="GMT-6">CST</option>
			<option value="GMT-5">EST</option>
			<option value="GMT-4">AST</option>
			<option value="GMT-3">NST</option>
			<option value="GMT-2">FST</option>
			<option value="GMT-1">WST</option>
			<option value="GMT+0">GMT</option>
			<option value="GMT+1">CET</option>
			<option value="GMT+2">EET</option>
			<option value="GMT+3">MSK</option>
			<option value="GMT+4">AMT</option>
			<option value="GMT+5">PKT</option>
			<option value="GMT+6">BST</option>
			<option value="GMT+7">THA</option>
			<option value="GMT+8">CST</option>
			<option value="GMT+9">JST</option>
			<option value="GMT+10">AEST</option>
			<option value="GMT+11">AEDT</option>
			<option value="GMT+12">NZST</option>
		</select>
		<button type="submit">Change Message Time</button>
	</form>
	<form id="change-channel-form" method="POST" action="?/changeChannel">
		<label for="channel">Channel</label>
		<select id="channels" name="channels" bind:value={channel}>
			{#each channels as channel}
				<option value={channel.id}>#{channel.name}</option>
			{/each}
		</select>
		<button type="submit">Change Channel</button>
	</form>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 50px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
		background-color: #36393f; /* Discord's dark theme background */
		color: #dcddde; /* Discord's light grey text color */
		border-radius: 8px; /* Rounder corners */
	}

	h1 {
		font-size: 28px;
		font-weight: 700;
		text-align: center;
		margin-bottom: 20px;
		color: #8e9297; /* Slightly darker text for headers */
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 30px;
	}

	label {
		font-weight: bold;
		font-size: 16px;
	}

	input,
	select {
		padding: 10px;
		font-size: 16px;
		border: 1px solid #2f3136; /* Discord's input border color */
		background-color: #2f3136; /* Discord's input background color */
		color: #dcddde; /* Discord's input text color */
		border-radius: 4px;
	}

	button {
		background-color: #5865f2; /* Discord's blurple */
		color: #ffffff;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:hover {
		background-color: #485ebe; /* Darker on hover */
	}

    button#back {
        background-color: #f04747; /* Discord's red */
    }
</style>
