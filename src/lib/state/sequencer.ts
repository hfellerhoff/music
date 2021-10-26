import { SequencerUtils } from '$lib/util/sequencer';
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
	stringScale: string[];
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
	isLoaded: true,
	stringScale: SequencerUtils.getScale(
		sequencerControlsDefaults.tonic,
		sequencerControlsDefaults.scale,
		sequencerControlsDefaults.measures
	),
	rows: SequencerUtils.getRows(
		SequencerUtils.getScale(
			sequencerControlsDefaults.tonic,
			sequencerControlsDefaults.scale,
			sequencerControlsDefaults.measures
		)
	),
	columns: SequencerUtils.getColumns(sequencerControlsDefaults.measures),
	activeTiles: {},
	...sequencerControlsDefaults
};

export const sequencer = writable<Sequencer>({ ...sequencerDefaults });

export const initSequencer = (): void => {
	sequencer.set({ ...sequencerDefaults });
};
