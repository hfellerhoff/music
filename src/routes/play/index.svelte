<script lang="ts">
	import Instrument from '$lib/components/Instrument.svelte';
	import MIDI from '$lib/components/MIDI.svelte';
	import { createInstruments, instruments } from '$lib/state/instruments';
	import type { MIDIMessage } from '$lib/types/midi';
	import { onMount } from 'svelte';
	import { Chord, Note, Scale } from 'theory.js';
	import * as Tone from 'tone';

	let synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | Tone.Sampler;
	onMount(() => {
		Tone.loaded().then(() => {
			// loaded = true;
			createInstruments();
		});

		instruments.subscribe((changed) => {
			if (changed[0]) {
				synth = $instruments[0].synth.toDestination();
				synth.volume.set(1);
			}
		});
	});

	const onMessage = (message: MIDIMessage) => {
		const note = new Scale(new Note(message[1]), []).getStringArray()[0];
		const velocity = message[2] / 127;

		if (synth) {
			switch (message[0]) {
				case 144:
					synth.triggerAttack(note, Tone.now(), velocity);
					break;
				case 128:
					synth.triggerRelease(note, Tone.now());
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
