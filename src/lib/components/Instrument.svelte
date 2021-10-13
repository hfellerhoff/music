<script lang="ts">
	import { instruments } from '$lib/state/instruments';

	import { Select, SelectItem } from 'carbon-components-svelte';

	const changeInstrument = (name: string) => {
		const index = $instruments.findIndex((inst) => inst.name === name);
		const instrument = $instruments.splice(index, 1)[0];
		$instruments.unshift(instrument);
	};
</script>

{#if $instruments && $instruments.length > 0}
	<Select
		labelText="Instrument"
		selected={$instruments[0].name}
		on:change={(e) => changeInstrument(e.detail)}
	>
		{#each $instruments as instrument}
			<SelectItem value={instrument.name} text={instrument.name} />
		{/each}
	</Select>
{/if}
