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
	const octaves = [2, 3, 4, 5, 6];

	let activeNotes: Record<string, boolean> = {};
	let sustainedNotes: Record<string, boolean> = {};

	let isMouseDown = false;
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
		sustainedNotes = { ...activeNotes };

		window.addEventListener('mousedown', (e) => {
			isMouseDown = true;
		});
		window.addEventListener('mouseup', (e) => {
			isMouseDown = false;
		});
	});

	let isSustained = false;
	const onMessage = (message: MIDIMessage) => {
		const type = message[0];
		const note = new Scale(new Note(message[1]), []).getStringArray()[0];
		const velocity = message[2] / 127;

		if (synth) {
			switch (type) {
				// Note On
				case 144:
					synth.triggerAttack(note, Tone.immediate(), velocity);
					activeNotes[note] = true;
					if (isSustained) sustainedNotes[note] = true;
					break;
				// Note Off
				case 128:
					if (!sustainedNotes[note]) {
						synth.triggerRelease(note, Tone.immediate());
					}
					activeNotes[note] = false;
					break;
				// Sustain
				case 176:
					if (message[2] === 127) {
						isSustained = true;
						sustainedNotes = { ...activeNotes };
					} else {
						Object.entries(sustainedNotes).forEach(([n, isPlaying]) => {
							if (isPlaying && !activeNotes[n]) {
								synth.triggerRelease(n, Tone.immediate());
							}
							sustainedNotes[n] = false;
						});
						isSustained = false;
					}
				default:
					break;
			}
		}
	};

	const playNote = (note: string) => {
		onMessage([144, new Note(note).midi, 100]);
	};
	const stopNote = (note: string) => {
		onMessage([128, new Note(note).midi, 100]);
	};
</script>

<svelte:head>
	<title>Play | Broswer Music by Henry Fellerhoff</title>
</svelte:head>

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
					on:mousedown={() => playNote(key + octave)}
					on:mouseenter={() => isMouseDown && playNote(key + octave)}
					on:focus={() => playNote(key + octave)}
					on:mouseleave={() => stopNote(key + octave)}
					on:mouseup={() => stopNote(key + octave)}
				/>
			{:else}
				<!-- white key -->
				<div
					class="piano-tile"
					class:active={activeNotes[key + octave]}
					on:mousedown={() => playNote(key + octave)}
					on:mouseenter={() => isMouseDown && playNote(key + octave)}
					on:focus={() => playNote(key + octave)}
					on:mouseleave={() => stopNote(key + octave)}
					on:mouseup={() => stopNote(key + octave)}
				>
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
