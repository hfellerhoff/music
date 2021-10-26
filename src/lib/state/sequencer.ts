import { writable } from 'svelte/store';
import { Scale } from 'theory.js';

interface SequencerTiles {
	[column: number]: {
		[row: number]: boolean;
	};
}

interface Sequencer {
	isLoaded: boolean;
	rows: number[];
	columns: number[];
	activeTiles: SequencerTiles;
	tonic: string;
	scale: number[];
	measures: number;
	octaves: number;
	highlightMeasureStart: boolean;
}

const sequencerControlsDefaults = {
	tonic: 'C3',
	scale: Scale.Major,
	measures: 8,
	highlightMeasureStart: true,
	octaves: 1
};

const sequencerDefaults: Sequencer = {
	isLoaded: false,
	rows: [],
	columns: [],
	activeTiles: {},
	...sequencerControlsDefaults
};

export const sequencer = writable<Sequencer>(sequencerDefaults);
export const initSequencer = (): void => {
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
	sequencer.subscribe((value) => (localStorage.sequencer = JSON.stringify(value)));
};
export const resetSequencerControls = (): void => {
	sequencer.update((value) => ({
		...value,
		...sequencerControlsDefaults
	}));
};
