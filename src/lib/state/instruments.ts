import { writable } from 'svelte/store';
import * as Tone from 'tone';

interface Instrument {
	name: string;
	synth: Tone.PolySynth | Tone.Sampler;
}

export const instruments = writable<Instrument[]>([]);

const startOctave = 2;
const endOctave = 6;
const notes = ['C'];
const pianoNotes = [];

for (let o = startOctave; o <= endOctave; o++) {
	notes.forEach((note) => pianoNotes.push(`${note}${o}`));
}

export const createInstruments = (): void => {
	instruments.set([
		{
			name: 'Piano',
			synth: new Tone.Sampler({
				urls: pianoNotes.reduce((acc, cur) => {
					acc[cur] = `${cur}.ogg`;
					return acc;
				}, {}),
				baseUrl: '/assets/piano/'
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
	]);
};
