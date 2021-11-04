<script>
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink
	} from 'carbon-components-svelte';
</script>

<Header company="Henry Fellerhoff" platformName="Music">
	<HeaderUtilities>
		<HeaderAction transition={{ duration: 200 }}>
			<HeaderPanelLinks>
				<HeaderPanelLink href="/">Back to Home</HeaderPanelLink>
				<HeaderPanelDivider>Music Creation Tools</HeaderPanelDivider>
				<HeaderPanelLink href="/play">Play</HeaderPanelLink>
				<HeaderPanelLink href="/sequencer">Sequencer</HeaderPanelLink>
				<HeaderPanelDivider>Henry Fellerhoff</HeaderPanelDivider>
				<HeaderPanelLink href="https://www.henryfellerhoff.com">henryfellerhoff.com</HeaderPanelLink
				>
				<HeaderPanelLink href="https://ko-fi.com/henryfellerhoff">Buy Me a Coffee</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
