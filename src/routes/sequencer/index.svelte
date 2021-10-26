<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	import FileSaver from 'file-saver';
	import { Note, Scale, Song } from 'theory.js';
	import { Button, ClickableTile, ToastNotification } from 'carbon-components-svelte';

	import { createInstruments, instruments } from '$lib/state/instruments';
	import SequencerControls from '$lib/components/SequencerControls.svelte';
	import { sequencerControls } from '$lib/state/sequencer';
	import { SequencerUtils } from '$lib/util/sequencer';

	// let lowerTonic = new Note($sequencerControls.tonic);
	// lowerTonic.lowerOctave();
	// let lowerScale = new Scale(lowerTonic, $sequencerControls.scale);

	// let higherTonic = new Note($sequencerControls.tonic);
	// higherTonic.raiseOctave();
	// let higherScale = new Scale(higherTonic, $sequencerControls.scale);

	let activeTiles = {};
	let changedTiles = {};

	let scale = SequencerUtils.getScale(
		$sequencerControls.tonic,
		$sequencerControls.scale,
		$sequencerControls.octaves
	);
	let columns: number[] = SequencerUtils.getColumns($sequencerControls.measures);
	let rows: number[] = SequencerUtils.getRows(scale);

	const refreshActiveTiles = () => {
		const previousActiveTiles = { ...activeTiles };
		activeTiles = {};
		columns.forEach((column) => {
			activeTiles[column] = {};
			const previousColumn = previousActiveTiles[column] || {};
			rows.forEach((row) => {
				activeTiles[column][row] = previousColumn[row] || false;
			});
		});
	};

	const clearActiveTiles = () => {
		columns.forEach((column) => {
			activeTiles[column] = {};
			rows.forEach((row) => {
				activeTiles[column][row] = false;
			});
		});
	};
	// clearActiveTiles();

	const toggleTile = (column: number, row: number) => {
		if (!changedTiles[column][row]) {
			activeTiles[column][row] = !activeTiles[column][row];
			changedTiles[column][row] = true;
		}
	};

	let playingColumn = 0;

	let loaded = false;
	let playing = false;
	let error = '';

	const playSong = () => {
		if (!loaded) return;

		playing = true;

		try {
			const synth = $instruments[0].synth.toDestination();
			synth.volume.set(0.5);
			const now = Tone.now();

			columns.forEach((column) => {
				rows.forEach((row) => {
					if (activeTiles[column][row]) {
						const note = scale[row];
						synth.triggerAttackRelease(note, '16n', now + column / 4);
					}
				});
			});

			const interval = setInterval(() => {
				playingColumn++;
				if (playingColumn === columns.length + 1) {
					playingColumn = 0;
					playing = false;
					clearInterval(interval);
				}
			}, 250);
		} catch (err) {
			playing = false;
			error = err;
			setTimeout(() => {
				error = '';
			}, 5000);
		}
	};

	let isMouseDown = false;
	onMount(() => {
		Tone.loaded().then(() => {
			loaded = true;
			createInstruments();
		});

		window.addEventListener('mousedown', (e) => {
			isMouseDown = true;
			changedTiles = {};
			columns.forEach((column) => {
				changedTiles[column] = {};
				scale.forEach((note) => {
					changedTiles[column][note] = false;
				});
			});
		});
		window.addEventListener('mouseup', (e) => {
			isMouseDown = false;
		});
	});

	const exportSong = async () => {
		const song = new Song({
			tonic: 'G4'
		});

		Object.entries(activeTiles).forEach(([column, rows]) => {
			let activeNotes: Note[] = [];
			Object.entries(rows).forEach(([row, isActive]) => {
				if (isActive) {
					const note = scale[row];
					activeNotes.push(new Note(note));
				}
			});
			const i = parseInt(column) - 1;
			const beats = i % 4;
			const measures = Math.floor(i / 4);
			song.playNotes(activeNotes, '4n', [measures, beats, 0]);
		});

		// console.log(song.events.map((e) => `${e.type} ${e.location.toString()}`));

		const midi = song.toMIDI();

		import('json-midi-encoder').then(({ encode }) => {
			encode(midi as any).then((midiFile) => {
				const blob = new Blob([midiFile]);
				FileSaver.saveAs(blob, 'export.midi');
			});
		});
	};

	const activeColor = '#f4f4f4';
	const playingColor = '#1062FE';

	$: {
		scale = SequencerUtils.getScale(
			$sequencerControls.tonic,
			$sequencerControls.scale,
			$sequencerControls.octaves
		);
		columns = SequencerUtils.getColumns($sequencerControls.measures);
		rows = SequencerUtils.getRows(scale);

		refreshActiveTiles();
	}
</script>

{#if error}
	<ToastNotification style="margin-top: 4rem; margin-left: 1rem;" title="Error" subtitle={error} />
{/if}

<svelte:head>
	<title>Sequencer | Henry Fellerhoff</title>
</svelte:head>

<h2>Sequencer</h2>
<SequencerControls />
<div id="container">
	<div id="sequencer" style={`grid-template-columns: repeat(${columns.length + 2}, 2rem);`}>
		{#each rows as row}
			<div class="sequencer-label">
				<h6>{scale[row]}</h6>
			</div>
			{#each columns as column}
				<div
					class="sequencer-tile"
					class:sequencer-tile--measure-start={$sequencerControls.highlightMeasureStart &&
						(column - 1) % 4 === 0}
					class:sequencer-tile--active={activeTiles[column][row]}
					class:sequencer-tile--playing={activeTiles[column][row] && playingColumn === column}
					on:click={() => toggleTile(column, row)}
					on:mouseover={() => {
						if (isMouseDown) toggleTile(column, row);
					}}
					on:mouseleave={() => {
						if (isMouseDown) toggleTile(column, row);
					}}
				/>
			{/each}
		{/each}
	</div>
	<div class="button-container">
		<Button kind="secondary" on:click={clearActiveTiles}>Clear</Button>
		<Button on:click={playSong} disabled={playing}>Play</Button>
		<Button kind="ghost" on:click={exportSong}>Export to MIDI</Button>
	</div>
</div>

<style>
	h2 {
		margin-bottom: 2rem;
	}

	.sequencer-tile {
		width: 2rem;
		height: 2rem;
		min-width: 0.5rem;
		min-height: 0.5rem;

		background: #262626;

		transition: 0.2s all;
	}

	.sequencer-tile--measure-start {
		background: #2e2e2e;
	}

	.sequencer-tile--active {
		background: #f4f4f4;
	}

	.sequencer-tile--playing {
		background: #1062fe;
	}

	#container {
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */

		margin: 4rem 0rem 0 0rem;
	}

	.button-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#sequencer {
		margin: 1rem 0;
		padding-bottom: 1.5rem;
		overflow: auto;
		white-space: nowrap;

		display: grid;
		grid-template-rows: repeat(7, 2rem);
	}

	.sequencer-label {
		display: flex;
		align-items: center;
		/* justify-content: center; */
		grid-column: 1/2;

		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
