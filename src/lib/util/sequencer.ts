import { Note, Scale } from 'theory.js';

export const SequencerUtils = {
	getColumns: (measures: number): number[] => {
		return Array(measures * 4)
			.fill(0)
			.map((_, i) => {
				return i + 1;
			});
	},

	getRows: (scale: string[]): number[] => {
		return Array(scale.length)
			.fill(0)
			.map((_, i) => {
				return i;
			})
			.reverse();
	},

	getScale: (tonic: string, scale: number[], octaves: number): string[] => {
		const baseScale = new Scale(new Note(tonic), scale);

		let compositeScale = [];
		for (let o = 0; o < octaves; o++) {
			compositeScale.push(baseScale.getStringArray());
			baseScale.notes.forEach((note) => note.raiseOctave());
		}
		compositeScale = compositeScale.flat();
		return compositeScale;
	}
};
