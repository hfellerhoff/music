<script lang="ts">
	import { initSequencer, sequencer } from '$lib/state/sequencer';

	import {
		Select,
		SelectItem,
		NumberInput,
		Checkbox,
		Button,
		ButtonSet
	} from 'carbon-components-svelte';
	import Instrument from './Instrument.svelte';
	import { Scale } from 'theory.js';

	import Save16 from 'carbon-icons-svelte/lib/Save16';
	import Reset16 from 'carbon-icons-svelte/lib/Reset16';
	import FolderOpen16 from 'carbon-icons-svelte/lib/FolderOpen16';

	let tonic = 'C';
	let octave = 3;

	const changeTonic = (value: string) => (tonic = value);
	const changeScale = (value: string) => {
		$sequencer.scale = [...value.split(',').map((v) => parseInt(v)), 12];
	};

	$: $sequencer.tonic = `${tonic}${octave}`;

	const loadSequencer = (): void => {
		$sequencer.isLoaded = false;
		const localSequencer = localStorage.getItem('sequencer');
		if (localSequencer) {
			sequencer.set({
				...JSON.parse(localSequencer),
				isLoaded: true
			});
		} else {
			sequencer.update((value) => ({
				...value,
				isLoaded: true
			}));
		}
	};
	const saveSequencer = (): void => {
		localStorage.sequencer = JSON.stringify($sequencer);
	};
	const resetAll = () => {
		initSequencer();
		tonic = 'C';
		octave = 3;
	};
</script>

<div class="sequencer-controls">
	<Button iconDescription="Save Project" icon={Save16} on:click={saveSequencer}>Save Project</Button
	>
	<Button
		iconDescription="Load Project"
		icon={FolderOpen16}
		on:click={loadSequencer}
		kind="secondary">Load Project</Button
	>
	<Button iconDescription="Reset All" icon={Reset16} kind="ghost" on:click={resetAll}
		>Reset All</Button
	>
	<div class="center-checkbox">
		<Checkbox
			labelText="Highlight Measure Start"
			checked={$sequencer.highlightMeasureStart}
			on:change={() => ($sequencer.highlightMeasureStart = !$sequencer.highlightMeasureStart)}
		/>
	</div>
	<Select labelText="Tonic" selected={'C'} on:change={(e) => changeTonic(e.detail)}>
		<SelectItem value={'C'} text={'C'} />
		<SelectItem value={'C#'} text={'C#'} />
		<SelectItem value={'Db'} text={'Db'} />
		<SelectItem value={'D'} text={'D'} />
		<SelectItem value={'D#'} text={'D#'} />
		<SelectItem value={'Eb'} text={'Eb'} />
		<SelectItem value={'E'} text={'E'} />
		<SelectItem value={'F'} text={'F'} />
		<SelectItem value={'F#'} text={'F#'} />
		<SelectItem value={'Gb'} text={'Gb'} />
		<SelectItem value={'G'} text={'G'} />
		<SelectItem value={'G#'} text={'G#'} />
		<SelectItem value={'Ab'} text={'Ab'} />
		<SelectItem value={'A'} text={'A'} />
		<SelectItem value={'A#'} text={'A#'} />
		<SelectItem value={'Bb'} text={'Bb'} />
		<SelectItem value={'B'} text={'B'} />
	</Select>
	<Select
		labelText="Scale"
		selected={Scale.Major.toString()}
		on:change={(e) => changeScale(e.detail)}
	>
		<SelectItem value={Scale.Major.toString()} text={'Major'} />
		<SelectItem value={Scale.Minor.toString()} text={'Minor'} />
		<SelectItem value={Scale.HarmonicMinor.toString()} text={'Harmonic Minor'} />
		<SelectItem value={Scale.Pentatonic.toString()} text={'Pentatonic'} />
		<SelectItem value={Scale.Blues.toString()} text={'Blues'} />
		<SelectItem value={Scale.MinorPentatonic.toString()} text={'Minor Pentatonic'} />
		<SelectItem value={Scale.Dorian.toString()} text={'Dorian'} />
		<SelectItem value={Scale.Phrygian.toString()} text={'Phrygian'} />
		<SelectItem value={Scale.Lydian.toString()} text={'Lydian'} />
		<SelectItem value={Scale.Mixolydian.toString()} text={'Mixolydian'} />
		<SelectItem value={Scale.Locrian.toString()} text={'Locrian'} />
		<SelectItem value={Scale.WholeTone.toString()} text={'Whole Tone'} />
		<SelectItem value={Scale.Octatonic.toString()} text={'Octatonic'} />
	</Select>

	<NumberInput
		value={$sequencer.measures}
		label="Measures"
		on:change={(e) => ($sequencer.measures = e.detail)}
	/>
	<Instrument />
	<NumberInput
		value={octave}
		label="Base Octave"
		on:change={(e) => (octave = e.detail)}
		min={0}
		max={8}
	/>
	<NumberInput
		value={$sequencer.octaves}
		label="Number of Octaves"
		on:change={(e) => ($sequencer.octaves = e.detail)}
		min={1}
		max={8}
	/>
</div>

<style>
	.sequencer-controls {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}
	@media screen and (max-width: 56rem) {
		.sequencer-controls {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.center-checkbox {
		/* padding-top: 1.5rem; */
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
