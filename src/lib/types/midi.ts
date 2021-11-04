export type MIDIMessage = [instruction: number, note: number, velocity: number];

export type MIDIInput = {
	connection: string;
	id: string;
	manufacturer: string;
	name: string;
	onmidimessage: null | ((message: MIDIMessageEvent) => void);
	onstatechange: null | (() => void);
	state: string;
	type: string;
	version: string;
};

export type MIDIMessageEvent = {
	data: [number, number, number];
};
