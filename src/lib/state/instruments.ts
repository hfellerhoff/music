import { writable } from 'svelte/store';
import * as Tone from 'tone';

interface Instrument {
	name: string;
	synth: any;
}

export const instruments = writable<Instrument[]>([]);

export const createInstruments = () => {
	instruments.set([
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
