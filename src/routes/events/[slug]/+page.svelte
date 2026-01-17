<script lang="ts">
	import { onMount } from 'svelte';
	import { events_compiledmap } from "$lib/markdown";
	import type { FrontEvent } from '$lib/types.js';
	import { user } from '$lib/stores.js';
	import { closed_events } from '$lib/helper.js';

	export let data;
	let events : {[key: string]: FrontEvent} = data['events'];
	let registeredEvents: string[];
	
	let frontend_url: string;
	let bg: HTMLElement;
	let currentEvent = events[data.eventID];
	let registered = false;
	// let registration_closed = false;
	let registration_closed = false;
	let registration_disabled = false;
	onMount(() => {
		bg.style.backgroundImage = `url("${currentEvent.image}")`;
		registeredEvents = []
		for (const user_event of $user.user_events) {
			registeredEvents.push(user_event.id)
		}
		frontend_url = window.location.origin
		setEvent(currentEvent)
	});
	// let currEveFee = events1[parseInt(currentEvent.id.slice(2))].fees

	const isEventClosed = (event: FrontEvent) =>
  		Array.isArray(event.tags) && event.tags.includes("closed");
	
	const setEvent = (event: FrontEvent) => {
		bg.style.backgroundImage = `url("${event.image}")`;
		currentEvent = events[event.id]	
		const code = (events_compiledmap[event.id])
		registration_disabled = event.id.startsWith("I");

		setTimeout(() => {
			if (iframe.contentWindow){
				iframe.contentWindow.scrollTo({ top: 0, behavior: 'smooth' });
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });
			update(code.data)
		},100)
		if(registeredEvents?.includes(event.id)){
			registered=true
		} else {
			registered = false;
		}
		// ✅ Close based on tags
  		registration_closed = isEventClosed(event);
	};

	
    let iframe: HTMLIFrameElement;
    const srcdoc = `
    <!doctype html>
    <html>
        <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap" rel="stylesheet">
            <script type='module'>
                let c;

                function update(source) {
				
                    const blob = new Blob([source],{ type: 'text/javascript' });
                    const url = URL.createObjectURL(blob);
					const content_holder = document.getElementById('content_holder')
					// console.log(source)
                    import(url).then(( { default : App }) => {
                        if (c) c.$destroy();

                        content_holder.innerHTML = '';
                        c = new App({ target: content_holder })
                    
                    })

                }


                window.addEventListener('message', event => {
                update(event.data)})
            <\/script>
            <style>
            * {
                box-sizing: border-box;
                font-family: var(--wfont);
            }
			@font-face {
				font-family: 'Atmospheric';
				src: url('/Fonts/Atmospheric.ttf') format('embedded-opentype'),
				/* Internet Explorer */
				url('/Fonts/Atmospheric.ttf') format('woff2'),
				/* Super Modern Browsers */
				url('/Fonts/Atmospheric.ttf') format('woff'),
				/* Pretty Modern Browsers */
				url('/Fonts/Atmospheric.ttf') format('truetype'),
				/* Safari, Android, iOS */
				url('/Fonts/Atmospheric.ttf') format('svg');
				/* Legacy iOS */
				font-weight: 200;
			}

            h1 {
                font-family: var(--sfont) !important;
                text-shadow: 1px 1px 1px #a5a5a5,
                    1px 1.5px 1px #a5a5a5,
                    1px 2px 1px #a5a5a5,
                    1px 2.5px 1px #a5a5a5,
                    1px 3px 1px #a5a5a5
                    ;
				font-size: 40px;
				text-align: center;	
            }
			::-webkit-scrollbar {
				width: 1px;
				background: transparent;
				/* make scrollbar transparent */
			}
			:root {
				--pfont: 'Raleway', sans-serif;
				--wfont: 'Roboto', sans-serif;
				--ofont: 'Arial', sans-serif;
				--sfont: 'Atmospheric', sans-serif;
			}
			.bg {
				position: fixed;
				top: 0;
				left: 0;
				height: 100vh;
				width: 100vw;
				filter: blur(5px) brightness(50%);
				background-position: center;
				background-size: cover;
				background-image: url(${currentEvent.image});
			}
            h2,h3 {
                font-family: var(--sfont) !important;
                text-align: center;
            }
			.content {
				z-index: 1;
				padding-top: 5.5em;
				padding-left: 1em;
				position: relative;
				width: 100%;
				display: flex;
				color: white;
				flex-direction: column;
				place-items: center;
				overflow-y: scroll;
			}
			body {
				margin: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
			#register {
				border: none;
				font-size: 20px;
				color: white;
				position: relative;
				text-decoration: none;
				z-index: 10;
			}
			@media (max-width:600px) {
				.content {
                    z-index: 1;
                    padding-top: 5em;
                    margin: 0;
                    padding-left: 0;
                }
                h1 {
                    font-size: 30px;
                }
            }
			@media (max-width:440px) {
                h1 {
                    font-size: 25px;
                }
            }
		}
        </style>
        </head>
        <body>
            <div class="content" id="content_holder"></div>
			<span id="register"></span>
        </body>  
    </html>
    `;
    let height = 0;
    function update(code: string) {
        console.log("Updating")
        iframe.contentWindow?.postMessage(code, "*");
    }

	// `${frontend_url}/payment/register?id=${currentEvent.id}`
	// `${frontend_url}/message/Thank you showing interest in Petrichor'25. Registrations will start in some time`
</script>


<div class="bg" bind:this={bg} />
<div class="parent">
	<div class="sidebar">
			<div class="sbcont">
		
				{#each Object.values(events) as event, index}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
				class="card"
				style="background-image: url('{event.image}');"
				on:mouseenter={() => {
					setEvent(event);	
				}}
				on:mousedown={() => {
					setEvent(event);
					
				}}
			>
			<p class="atmos"> 
					{event.name}
				</p>
		</div>
				{/each}
			</div>
	</div>
	<div class="eventarea">

	<iframe
	class="content"
	bind:this={iframe}
	title="repl"
	{srcdoc}
	{height}
	/>
		{#if !registration_disabled}
				<a id="register" class={registration_closed || registered ? "closed" : ""} href={(registration_closed || registered) ? "#" : 
				`${frontend_url}/payment/register?id=${currentEvent.id}`
			}>{
					registered ? "Registered" : registration_closed ? "Registration Closed" : "Register" 
				}</a>
		{/if}
	</div>
</div>

<style>
	.closed {
		background-color: rgba(42, 30, 30, 0.545) !important;
		cursor: pointer;
	}
	.eventarea {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		position: relative;
	}
	#register:hover {
		background-color: rgb(255, 255, 255);
		color: black;
	}
	#register {
		border: none;
		padding: 0.8em;
		padding-inline: 1em;
		background-color: rgba(237, 237, 237, 0.137);
		border-radius: 0.4em;
        margin: 0 10px;
		border: unset;
		color: white;
		font-size: 20px;
		transition: 200ms ease-in-out;
		font-family: var(--pfont) !important;
		font-weight: bold;
		right: 0;
		bottom: 0;
		text-decoration: none;
		z-index: 10;
	}

	.card {
		width: 90%;
		aspect-ratio: 2;
		background-position: center;
		background-size: cover;
		position: relative;
		cursor: pointer;
		margin: 1em;
		border-radius: 0.4em;
		transition: 200ms ease-in-out;
		overflow: hidden;
	}
	.card::before {
		background: rgb(0, 0, 0);
		background: -moz-linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		background: -webkit-linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		transition: 100ms;
	}
	.card:hover {
		transform: scale(1.08) translateX(0px);
		z-index: 100000;
	}
	.card > p {
		position: absolute;
		font-size: 20px;
		bottom: 0;
		left: 1em;
	}
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		background-position: center;
		background-size: cover;
		transition: background-image 2s;
		filter: blur(5px) brightness(50%);
	}
	.sidebar {
		scrollbar-width: none;  /* Firefox */
		overflow-y: scroll;
		height: 100vh;
		padding-top: 80px;
		width: 25%;
		background-color: #28282d98;
		backdrop-filter: blur(40px);
	}
	.sbcont{
		animation: scrollpc 1.5s ease-in-out;
		animation-delay: 1s;
		
	}
	
	@keyframes scrollpc { 
		from {
			margin-top: 0;
		}
		50%{
			margin-top: -70%;
		}
		to{
			margin-top: 0;
		}
	
	}
	@keyframes scrollmob { 
		from {
			margin-left: 0;
		}
		50%{
			margin-left: -70%;
		}
		to{
			margin-left: 0;
		}
	
	}
	.parent {
		display: flex;
		width: 100%;
		/* font-size: 20px; */
	}
	.content {
		z-index: 1;
		position: relative;
		width: 100%;
		border: none	;
		display: flex;
		height: 100vh;
		flex-direction: column;
		place-items: center;
		overflow-y: scroll;
	}
	
	@keyframes banneranim {
		0% {
			background-position: 0 0;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0 0;
		}
	}
		@media (max-width: 600px) {
		.content {
			z-index: 1;
			padding-top: 2em;
		}
		.sidebar {
			height: 17svh;
			display: flex;
			padding-top: 0px;
			overflow-x: auto; /* Use overflow-x for horizontal scroll */
			width: 100%; 
			position: fixed;
			bottom: 0;
			z-index: 30;
			margin: 0;
		}
		
		.sbcont > *{
			
			display: block !important;
		}
		.sbcont{
			display: flex;
			animation: scrollmob 1.5s ease-in-out;
			animation-delay: 1s;
		}

		.card {
			all: unset;
			width: 12rem;
			background-position: center;
			background-size: cover;
			position: relative;
			cursor: pointer;
			flex: 0 0 auto; /* Prevent cards from stretching to fill available space */
			margin-right: 10px; /* Add some spacing between cards if needed */
			border-radius: 1em;
			overflow: hidden;
			margin-top: 0.4em;
		}
		.card > p {
			font-size: 17px;
		}

		.parent {
			flex-direction: column-reverse;
			/* width: 100vw; */
		}
		.eventarea {
			margin-bottom: 17svh;
		}
		.content {
			overflow-x: hidden;
		}
		.sbcont {
			overflow: scroll;
		}
		.content {
			padding-left: 0;
		}
	}
</style>
