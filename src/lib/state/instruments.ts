import { writable } from 'svelte/store';
import * as Tone from 'tone';

interface Instrument {
	name: string;
	synth: Tone.PolySynth | Tone.Sampler;
}

export const instruments = writable<{
	selected: Instrument | undefined;
	all: Instrument[];
}>({
	selected: undefined,
	all: []
});

const initSampler = (
	baseUrl,
	notes,
	startOctave,
	endOctave
): {
	urls: Record<string, string>;
	baseUrl: string;
} => {
	const pianoNotes = [];

	for (let o = startOctave; o <= endOctave; o++) {
		notes.forEach((note) => pianoNotes.push(`${note}${o}`));
	}

	return {
		urls: pianoNotes.reduce((acc, cur) => {
			acc[cur] = `${cur}.ogg`;
			return acc;
		}, {}),
		baseUrl
	};
};

export const createInstruments = (): void => {
	const all = [
		{
			name: 'Piano',
			synth: new Tone.Sampler({
				...initSampler('/assets/piano/', ['C'], 2, 6),
				release: 1
			})
		},
		{
			name: 'Mono Synth',
			synth: new Tone.PolySynth(Tone.MonoSynth)
		},
		{
			name: 'AM Synth',
			synth: new Tone.PolySynth(Tone.AMSynth)
		},
		{
			name: 'FM Synth',
			synth: new Tone.PolySynth(Tone.FMSynth)
		}
	];

	instruments.set({
		selected: all[0],
		all
	});
};
