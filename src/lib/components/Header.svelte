<script>
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SkipToContent
	} from 'carbon-components-svelte';
</script>

<Header company="Henry Fellerhoff" platformName="Music">
	<HeaderUtilities>
		<HeaderAction transition={{ duration: 200 }}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Music Creation Tools</HeaderPanelDivider>
				<HeaderPanelLink href="/sequencer">Sequencer</HeaderPanelLink>
				<HeaderPanelDivider>Henry Fellerhoff</HeaderPanelDivider>
				<HeaderPanelLink href="https://www.henryfellerhoff.com">henryfellerhoff.com</HeaderPanelLink
				>
				<HeaderPanelLink href="https://ko-fi.com/henryfellerhoff">Buy Me a Coffee</HeaderPanelLink>
				<!-- <HeaderPanelDivider>Sample Packs by Modern.fm</HeaderPanelDivider>
				<HeaderPanelLink
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.modern.fm/free?ref=create">Free</HeaderPanelLink
				>
				<HeaderPanelLink
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.modern.fm/shop?ref=create">Shop</HeaderPanelLink
				>
				<HeaderPanelLink
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.modern.fm/exclusive?ref=create">Exclusive</HeaderPanelLink
				>
				<HeaderPanelDivider>Modern.fm Community</HeaderPanelDivider>
				<HeaderPanelLink target="_blank" rel="noopener noreferrer" href="https://discord.gg/AuHucr9"
					>Join Discord</HeaderPanelLink
				> -->
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
