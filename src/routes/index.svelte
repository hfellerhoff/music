<script>
	import { ClickableTile } from 'carbon-components-svelte';

	Array(5 * 4)
		.fill(0)
		.forEach((item) => console.log(item));
</script>

<svelte:head>
	<title>Create by Modern.fm</title>
</svelte:head>

<ClickableTile href="/sequencer" style="padding: 2rem;">
	<h3>Sequencer</h3>
	<p>Create MIDI melodies and export for use in your DAW of choice.</p>
</ClickableTile>
