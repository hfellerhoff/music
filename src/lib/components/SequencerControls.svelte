<script lang="ts">
	import { sequencerControls } from '$lib/state/sequencer';

	import { Select, SelectItem, NumberInput, Checkbox } from 'carbon-components-svelte';
	import Instrument from './Instrument.svelte';
	import { Scale } from 'theory.js';

	let tonic = 'C';
	let octave = 3;

	const changeTonic = (value: string) => (tonic = value);
	const changeScale = (value: string) => {
		$sequencerControls.scale = [...value.split(',').map((v) => parseInt(v)), 12];
	};

	$: $sequencerControls.tonic = `${tonic}${octave}`;
</script>

<div class="sequencer-controls">
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
		value={$sequencerControls.measures}
		label="Measures"
		on:change={(e) => ($sequencerControls.measures = e.detail)}
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
		value={$sequencerControls.octaves}
		label="Number of Octaves"
		on:change={(e) => ($sequencerControls.octaves = e.detail)}
		min={1}
		max={8}
	/>

	<div class="center-checkbox">
		<Checkbox
			labelText="Highlight Measure Start"
			checked={true}
			on:change={() =>
				($sequencerControls.highlightMeasureStart = !$sequencerControls.highlightMeasureStart)}
		/>
	</div>
	<!-- <div class="center-checkbox">
		<Checkbox
			labelText="Show Lower Octave"
			checked={false}
			on:change={() => ($sequencerControls.octaveBelow = !$sequencerControls.octaveBelow)}
		/>
	</div>
	<div class="center-checkbox">
		<Checkbox
			labelText="Show Higher Octave"
			checked={false}
			on:change={() => ($sequencerControls.octaveAbove = !$sequencerControls.octaveAbove)}
		/>
	</div> -->
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
		padding-top: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
