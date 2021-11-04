<script>
	import { ClickableTile } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>Create Music | Henry Fellerhoff</title>
</svelte:head>

<div>
	<ClickableTile href="/play" style="padding: 2rem;">
		<h3>Play</h3>
		<p>Connect a MIDI keyboard and play!</p>
	</ClickableTile>

	<ClickableTile href="/sequencer" style="padding: 2rem;">
		<h3>Sequencer</h3>
		<p>Create MIDI melodies and export for use in your DAW of choice.</p>
	</ClickableTile>
</div>

<style>
	div {
		display: grid;
		gap: 2rem;
	}
</style>
