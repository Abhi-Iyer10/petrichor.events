<script lang="ts">
	import GAIL from "$lib/assets/Sponsors/GAIL.jpg";
	import Dyson from "$lib/assets/Sponsors/Dyson_logo.png";
	import Jockey from "$lib/assets/Sponsors/Jockey-Logo.png";
	import KCOverseas from "$lib/assets/Sponsors/KCOverseas.jpg";
	import Techin from "$lib/assets/Sponsors/Techin.jpg";
	import TIME from "$lib/assets/Sponsors/TIME.png";
	import INGLO from "$lib/assets/Sponsors/INGO.jpg";
	import ME from "$lib/assets/Sponsors/ME.png";
	import SBI from "$lib/assets/Sponsors/SBI.jpeg";
	import Frame from "$lib/assets/Sponsors/Frame.jpg";
	import Neurobots from "$lib/assets/Sponsors/Neurobots.jpeg";
	import IITiansNetwork from "$lib/assets/Sponsors/IITiansNetwork.png"
	import Feelfirst from "$lib/assets/Sponsors/feelfirst.png"
	import Sponsor from './Sponsor.svelte';
</script>

<h1 id="heading1">
	<span class="atmos" style="color:blueviolet">PETRICHOR'26</span><br> IS SPONSORED BY
</h1>

<div class="main">
	<!-- <Sponsor name="GAIL" img={GAIL} title="Co-Title Sponsor" /> -->
	<Sponsor name="Neurobots" img={Neurobots} title="Knowledge & Title Sponsor"/>
	<Sponsor name="IITians Network" img={IITiansNetwork} title="Community Partner"/>
	<Sponsor name="FeelFirst Publishing LLP" img={Feelfirst} title="Silver Sponsor"/>
</div>

<!-- <div id="all">
	<Sponsor name="State Bank of India" img={SBI} title="Associate Sponsor" />
	<Sponsor name="KC Overseas" img={KCOverseas} title="Academic Partner" />
	<Sponsor name="TIME" img={TIME} title="Academic Partner" />
	<Sponsor name="TechIn" img={Techin} title="Hackathon Partner" />
	<Sponsor name="Dyson" img={Dyson} title="Sponsor" />
	<Sponsor name="Jockey" img={Jockey} title="Sponsor" />
	<Sponsor name="INGLU" img={INGLO} title="Event Curation Partner" />
	<Sponsor name="My Equation" img={ME} title="Event Partner" />
	<Sponsor name="Himalayan Yeti" img={Frame} title="Grooming Partner" />
</div> -->


<!-- 
<h2 id="heading2" class="atmos" style="color:rgb(216, 191, 238)">In Partnership with</h2>

<div id="all1">
	<Sponsor name="Caazkaro" img={Cazzkaro} title="Merch Partner" />
	<Sponsor name="Make Your Own Perfume" img={Gift} title="Gift Partner" />
</div> -->
<div style="height: 5rem;" />

<style>
	.main {
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 10em;
		margin-bottom: 8em;
	}
	* {
		box-sizing: border-box;
		margin: 0.2rem 0rem;
	}
	#all{
		display: flex;
		flex-wrap: wrap;
		gap: 10rem;
		align-items: center;
		align-items: center;
		justify-content: center;
		grid-template-columns: auto auto auto;
	}
	/* #all1 {
		display: flex;
		flex-wrap: wrap;
		gap: 10rem;
		align-items: center;
		align-items: center;
		justify-content: center;
		grid-template-columns: auto auto;
	} */

	#heading1 {
		margin-top: 8rem;
		margin-bottom: 4rem;
		text-align: center;
	}
	/* #heading2 {
		margin: 4rem;
		text-align: center;
	} */
	/* Mobile Version */
	@media screen and (max-width: 960px) and (min-width: 600px) {
		#all,
		.main {
			display: grid;
			grid-template-columns: auto auto;
		}
		/* #all1 {
			grid-template-columns: auto auto;
		} */
	}
	@media screen and (max-width: 600px) {
		#all,
		.main {
			display: grid;
			grid-template-columns: auto;
		}
		/* #all1 {
			grid-template-columns: auto;
		} */
	}
</style>
