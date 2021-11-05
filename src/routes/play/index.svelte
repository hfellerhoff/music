<script lang="ts">
	import Instrument from '$lib/components/Instrument.svelte';
	import MIDI from '$lib/components/MIDI.svelte';
	import { createInstruments, instruments } from '$lib/state/instruments';
	import type { MIDIMessage } from '$lib/types/midi';
	import { onMount } from 'svelte';
	import { Note, Scale } from 'theory.js';
	import * as Tone from 'tone';

	const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	let offset = -4;
	const getOffset = (key: string) => {
		if (key === 'F#' || key === 'C#') offset += 6;
		else offset += 3;
		return offset;
	};
	const octaves = [1, 2, 3, 4, 5, 6];

	let activeNotes: Record<string, boolean> = {};

	let synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | Tone.Sampler;
	onMount(() => {
		Tone.loaded().then(() => {
			// loaded = true;
			createInstruments();
		});

		instruments.subscribe((changed) => {
			if (changed.selected) {
				synth = $instruments.selected.synth.toDestination();
			}
		});

		activeNotes = octaves.reduce((acc, octave) => {
			let dict = {};
			keys.forEach((note) => {
				dict[note + octave] = false;
			});
			return {
				...acc,
				...dict
			};
		}, {} as Record<string, boolean>);
	});

	const onMessage = (message: MIDIMessage) => {
		const note = new Scale(new Note(message[1]), []).getStringArray()[0];
		const velocity = message[2] / 127;

		if (synth) {
			switch (message[0]) {
				case 144:
					synth.triggerAttack(note, Tone.now(), velocity);
					activeNotes[note] = true;
					break;
				case 128:
					synth.triggerRelease(note, Tone.now());
					activeNotes[note] = false;
					break;
				default:
					break;
			}
		}
	};
</script>

<MIDI {onMessage}>
	<Instrument />
</MIDI>

<div class="piano">
	{#each octaves as octave}
		{#each keys as key}
			{#if key.includes('#')}
				<!-- black key -->
				<div
					class="piano-tile piano-tile--black"
					class:active={activeNotes[key + octave]}
					style={`--offset: ${getOffset(key)}rem`}
				/>
			{:else}
				<!-- white key -->
				<div class="piano-tile" class:active={activeNotes[key + octave]}>
					<span>{key}{octave}</span>
				</div>
			{/if}
		{/each}
	{/each}
</div>

<style>
	.piano {
		overflow: auto;
		white-space: nowrap;
		margin-top: 2rem;

		display: grid;
		grid-template-columns: repeat(1000, 1fr);
		position: relative;
	}

	.piano-tile {
		width: 3rem;
		height: 12rem;

		background: #333030;
		border: 2px solid #0f0e0e;

		-webkit-user-select: none;
		-webkit-user-drag: none;
		-webkit-app-region: no-drag;

		transition: 0.2s all;
		cursor: pointer;

		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 1rem;
		color: whitesmoke;
	}

	.piano-tile--black {
		position: absolute;
		left: var(--offset);
		width: 2rem;
		height: 8rem;
		top: 0;
		z-index: 1;
		background: #171717;
		color: white;
	}

	.active {
		background: white;
		color: black;
	}
</style>
