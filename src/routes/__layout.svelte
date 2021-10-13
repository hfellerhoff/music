<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { Content } from 'carbon-components-svelte';

	import 'carbon-components-svelte/css/g100.css';
</script>

<Header />
<main>
	<slot />
</main>

<style>
	main {
		padding: 6rem 4rem 4rem 4rem;
	}

	@media screen and (max-width: 56rem) {
		main {
			padding: 4rem 2rem 2rem 2rem;
		}
	}
</style>
