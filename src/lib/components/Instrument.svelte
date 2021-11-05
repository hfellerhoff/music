<script lang="ts">
	import { instruments } from '$lib/state/instruments';

	import { Select, SelectItem } from 'carbon-components-svelte';

	const changeInstrument = (name: string) => {
		const index = $instruments.all.findIndex((inst) => inst.name === name);
		instruments.update((inst) => ({
			...inst,
			selected: inst.all[index]
		}));
	};
</script>

{#if $instruments && $instruments.all.length > 0}
	<Select
		labelText="Instrument"
		selected={$instruments.selected.name}
		on:change={(e) => changeInstrument(e.detail)}
	>
		{#each $instruments.all as instrument}
			<SelectItem value={instrument.name} text={instrument.name} />
		{/each}
	</Select>
{/if}
