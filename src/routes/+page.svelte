<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import type { PageData } from './$types';
	export let data: PageData;

	let { props, supabase, session } = data;
	let { day, redirect_uri } = props;
	let { name: dotw, index } = day;

	$: ({ supabase } = data);

	const handleLoginWithDiscord = async () => {
		let { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {
				redirectTo: redirect_uri
			}
		});

		if (error) {
			console.error(error);
			return;
		}

		window.location.href = data.url || '/';
	};
</script>

<main>
	<div class="flexbox">
		{#if session === undefined || session === null}
			<button on:click={() => handleLoginWithDiscord()}>Login with Discord </button>
		{:else}
			<button
				on:click={() => {
					window.location.href = '/dashboard';
				}}>Dashboard</button
			>
			<h3>Welcome, {session.user.user_metadata.full_name}!</h3>
		{/if}
		{#if index === 0}
			<h1>Today is FrogBot's Day of Rest.</h1>
			<h2>Come back tomorrow for a new picture.</h2>
		{:else}
			<img src="images/{index}.png" alt={dotw} />
		{/if}
	</div>

	<MetaTags title="Home" titleTemplate="%s | FrogBot" description="See the image of the day!" />
</main>

<style lang="postcss">
	.flexbox {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: linear-gradient(135deg, #282c34, #434854);
	}

	img {
		width: 28%;
		height: auto;
		margin-top: 0.8rem;
		margin-bottom: 1.2rem;
		border: 5px solid #fff;
		border-radius: 15px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
	}

	img:hover {
		transform: scale(1.03);
	}

	:global(body) {
		background-color: #282c34;
		color: #fff;
		font-family: 'Poppins', sans-serif;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	button {
		background-color: #5865f2;
		color: #ffffff;
		border: none;
		padding: 12px 24px;
		border-radius: 50px; /* A higher border-radius value for a pill-like shape */
		font-weight: 600; /* Makes the font a bit bolder */
		font-size: 1rem; /* Adjusting the font size */
		letter-spacing: 0.05em; /* Adding some spacing between letters */
		cursor: pointer;
		position: absolute;
		top: 10px;
		right: 10px;
		transition: all 0.3s ease-in-out; /* Smooth transition for all changes */
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* A subtle shadow for depth */
	}

	button:hover {
		background-color: #485ebf;
		transform: translateY(-2px); /* Button moves up a bit when hovered */
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* A deeper shadow on hover */
	}

	button:active {
		transform: translateY(1px); /* Button slightly presses down when active/clicked */
		box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2); /* Lesser shadow for a pressed effect */
	}

	@media screen and (max-width: 768px) {
		.flexbox {
			padding: 20px; /* Some padding so content doesn't touch the edges */
		}

		img {
			width: 70%; /* Increasing image width for mobile for better visibility */
			margin-top: 0.5rem;
			margin-bottom: 0.8rem;
		}

		button {
			font-size: 0.9rem; /* Adjusting font size for the button */
			padding: 10px 20px; /* Adjusting the padding of the button */
			top: 5px; /* Reducing the distance from the top */
			right: 5px; /* Reducing the distance from the right */
		}

		h1 {
			font-size: 1.5rem; /* Adjusting the size of the h1 for better fit */
			text-align: center; /* Ensuring the text is centered */
			margin-bottom: 20px; /* Providing more space between the h1 and the image */
		}
	}
</style>
