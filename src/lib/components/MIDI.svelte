<script lang="ts">
	import type { MIDIInput, MIDIMessage } from '$lib/types/midi';

	import { Tag, Tile, Select, SelectItem, SelectSkeleton } from 'carbon-components-svelte';
	import { onMount } from 'svelte';

	export let onMessage: (message: MIDIMessage) => void;

	const MIDIMessages = {
		144: 'noteOn',
		128: 'noteOff'
	};

	let isLoadingInputs = true;
	let status: {
		color:
			| 'warm-gray'
			| 'red'
			| 'green'
			| 'magenta'
			| 'purple'
			| 'blue'
			| 'cyan'
			| 'teal'
			| 'gray'
			| 'cool-gray'
			| 'high-contrast';
		message: string;
	} = {
		color: 'warm-gray',
		message: 'Disconnected'
	};
	let inputs: MIDIInput[] = [];

	let inputID: string = '0';

	onMount(() => {
		if ((navigator as any).requestMIDIAccess) {
			(navigator as any).requestMIDIAccess().then(function (access) {
				// Get lists of available MIDI controllers
				const inputIterator = access.inputs.values();
				// const outputs = access.outputs.values();

				let input = inputIterator.next();
				while (input.value) {
					inputs = [...inputs, input.value];
					input = inputIterator.next;
				}

				access.onstatechange = function (e) {
					// Print information about the (dis)connected MIDI controller
					// console.log(e.port.name, e.port.manufacturer, e.port.state);
				};
			});
		} else {
			status = {
				color: 'red',
				message: 'Unsupported'
			};
		}
		isLoadingInputs = false;
	});

	$: {
		if (inputID === '0') {
			status = {
				color: 'warm-gray',
				message: 'Disconnected'
			};

			inputs.forEach((input) => {
				input.onmidimessage = null;
			});
		} else {
			const midiInput = inputs.find((input) => input.id === inputID);
			midiInput.onmidimessage = (message) => {
				onMessage(Array.from(message.data) as MIDIMessage);
			};

			status = {
				color: 'green',
				message: 'Connected'
			};
		}
	}

	const handleSelect = (e) => (inputID = e.target.value);
</script>

<Tile style="display: flex; align-items: center; justify-content: space-between;">
	<div class="option-container">
		{#if status.color === 'red'}
			<p>Change to Chrome, Edge, or Opera to connect a MIDI controller.</p>
		{:else}
			{#if !isLoadingInputs}
				<Select on:input={handleSelect} labelText="MIDI Input" selected="none">
					<SelectItem value="0" text="None" />
					{#each inputs as input}
						<SelectItem value={`${input.id}`} text={input.name} />
					{/each}
				</Select>
			{:else}
				<SelectSkeleton />
			{/if}
			<div class="slot-container">
				<slot />
			</div>
		{/if}
	</div>
	<Tag type={status.color}>{status.message}</Tag>
</Tile>

<style>
	.option-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.slot-container {
		margin-left: 1rem;
	}
</style>
