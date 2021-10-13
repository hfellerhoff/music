import { writable } from 'svelte/store';
import { Scale } from 'theory.js';

interface SequencerControls {
	tonic: string;
	scale: number[];
	measures: number;
	highlightMeasureStart: boolean;
	octaves: number;
}

export const sequencerControls = writable<SequencerControls>({
	tonic: 'C3',
	scale: Scale.Major,
	measures: 8,
	highlightMeasureStart: true,
	octaves: 1
});
