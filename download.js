import { compile } from "svelte/compiler";
import { compile as mdcompile } from "mdsvex"
import { build } from 'esbuild';
import fs from "fs"
import path from "path"
import dotenv from "dotenv";

try {
    dotenv.config()
} catch (e) {
    console.log(e.toString())
}

const skip_event = ["CF11", "CP14", "TP08"]

// NOTE: chnage it every year to fetch events of that year
const YEAR = "2026"

const CDN_URL = "https://cdn.jsdelivr.net/npm";

const components_map = new Map()

// const backend_url = 'http://127.0.0.1:8000/'
// const backend_url = 'https://petri-back.vercel.app/'
const backend_url = 'https://petrichor-backend.vercel.app/'


function generate_lookup(components) {
    components.forEach(component => {
        components_map.set(`./${component.name}.${component.type}`, component)
    })
}


export const pre_components = [
    {
        id: 1,
        name: 'Section',
        type: "svelte",
        source: `<script lang="ts">
    export let name;

</script>
<div id={name}>

    <slot/>
</div>

<style>
    div {
    width: 90%;
        border-radius: 10px;
        margin: 10px;
        padding: 10px;
        font-size: 22px;
    }
    @media (max-width: 600px) {
        div {
        font-size: 17px;
        padding: 0px;
        margin: 0px;
        }
    }
</style>`
    },
    {
        id: 1,
        name: 'Box',
        type: "svelte",
        source: `<div><slot/></div>

<style>
	div {
		display: flex;
		flex-direction: column;
		width: 85%;
		place-items: center;
		background-color: rgba(0, 0, 0, 0.146);
		/*
		* Created with https://www.css-gradient.com
		* Gradient link: https://www.css-gradient.com/?c1=ab84d1&c2=1422c1&gt=l&gd=dtl
		*/
		/* background: #ab84d14b; */
		/* background: linear-gradient(135deg, #ab84d134, #1422c139); */
		backdrop-filter: blur(100px);
		background-size: 150% 150%;
		padding: 1rem;
		border-radius: 12px;
		margin-top: 1em;
		/* animation: banneranim 5s linear infinite; */
	}
</style>`
    },
    {
        id: 1,
        name: 'Person',
        type: "svelte",
        source: `<script lang="ts">
    export let name = "John Doe";
    export let phone = "123-456-7890";
    import { onMount } from "svelte";

    let url = "https://www.svgrepo.com/download/454078/account.svg";
    let origin = "https://finance-petrichor.vercel.app";

    onMount(async () => {
        if (window.top.location.origin) origin = window.top.location.origin;
        // console.log(phone)
        // img_div = document.getElementById("back_bg") as HTMLDivElement;
        if (phone != "123-456-7890") {
            // console.log("Origin:", origin);
            
            if (
                origin == "https://finance-petrichor.vercel.app" ||
                origin == "http://localhost:5173"
            ) {
                console.log("Fetching image", origin);
                await fetch("https://petri-back.vercel.app/internal/image/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    credentials: "include",
                    mode: "cors",
                    body: JSON.stringify({
                        name: name
                    }),
                })
                .then((res) => res.json())
                .then((res) => {
                    // console.log("Got Image");
                    const imageURL = \`data:image/png;base64,\${res.image}\`;
                    url = \`\${imageURL}\`;
                })
                .catch((err) => {
                    console.log("image fetch error: ", err.toString());
                });
            } else {
                // console.log("from uploads")
                url = \`\${origin}/uploads/\${name.toLowerCase()}.webp\`;
            }
        } else {
            url = "https://picsum.photos/200/300" 
        }
    });
</script>

<div class="main">
    <div
        class="backpic"
        id="back_bg"
        style="background-image: url('{url}');"
    ></div>
    <h2>{name}</h2>
    <p>{phone}</p>
</div>

<style>
    .main {
        background-color: rgb(27, 27, 27, 0.5);
        backdrop-filter: blur(12px);
        font-family: var(--pfont);
        width: min-content;
        margin: 1em;
        border-radius: 1em;
        overflow: hidden;
        width: 14em;
    }
    .backpic {
        background-size: cover;
        background-position: center;
        position: relative;
        height: 12em;
        width: 12em;
        border-radius: 0.4em;
        margin: 1rem;
        background-repeat: no-repeat;
    }
    h2 {
        font-family: var(--pfont) !important;
        overflow: hidden;
        width: 100% !important;
        text-overflow: clip;
        word-wrap: break-word;
        font-weight: 700;
    }
    p {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        letter-spacing: 0.05em;
        margin: 1rem;
        overflow: hidden;
        text-align: center;
        border-radius: 0 0 0.4em 0.4em;
    }
</style>
`
    },
    {
        id: 1,
        name: 'FlexSection',
        type: "svelte",
        source: `<div><slot /></div>

<style>
    div{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    div h1{
        diplay: inline;
    }
</style>`
    },
    {
        id: 1,
        name: 'CenterSection',
        type: "svelte",
        source: `<script lang="ts">
    export let name;
</script>

<div id="{name}"><slot/></div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px;
        text-align: center;
    }
    p {
        margin: 10px;
        text-align: center;
    }
</style>`
    }
    , {
        id: 1,
        name: 'Button',
        type: "svelte",
        source: `<script lang="ts">
    export let url = "#rules";
    import { onMount } from "svelte";
    let origin = ""
    onMount(() => {
        origin = window.top?.location.url    
    })

	function handleClick() {
		if (url.startsWith("#")) {
			const rulesElement = document.getElementById(url.replace('#', ""));
			if (rulesElement) {
				rulesElement.scrollIntoView({ behavior: 'smooth' });
				rulesElement.focus(); // Optionally focus the element
			}
		} else if (url == "register") {
            window.top.location.href = \`\${origin}/#register\`
        }else {
			window.top.location.href = url;
		}
	}
</script>

<div class="buttons">
    <button class="a-unset register" on:click={handleClick}><slot/></button>
</div>

<style>
    .buttons {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
	.buttons > a {
		margin-left: 0.75em;
		margin-right: 0.75em;
	}
	button {
		border: none;
		background-color: transparent;
	}
    .a-unset {
        text-decoration: none;
        color: white;
    }
    .register {
		padding: 0.8em;
		padding-inline: 1em;
		background-color: rgba(237, 237, 237, 0.137);
		border-radius: 0.4em;
        margin: 0 10px;
		border: unset;
		color: white;
		font-size: 20px;
		transition: 200ms ease-in-out;
	}
	.register:hover {
		background-color: rgb(255, 255, 255);
		color: black;
	}

	@media (max-width: 600px){
		.register {
			display: block;
			margin-bottom: 1em;
			text-align: center;
		}
        .buttons {
            margin: 0px;
        }
	}
</style>

`
    }
]


async function compileasync(markdown) {
    generate_lookup([
        ...pre_components,
        {
            id: 100,
            name: 'markdown',
            source: markdown,
            type: 'mdx',
        },
    ]);

    const plugins = [
        {
            name: 'esbuild-plugin',
            setup(build) {
                build.onResolve({ filter: /.*/ }, (args) => {
                    // console.log("J", args)
                    if (args.path === 'svelte') {
                        return { path: `${CDN_URL}/svelte/internal/index.mjs`, namespace: 'cdn' };
                    }
                    if (args.path.startsWith('svelte/')) {
                        return { path: `${CDN_URL}/svelte/${args.path.slice(7)}/index.mjs`, namespace: 'cdn' };
                    }
                    // console.log("bye")
                    if (components_map.has(args.path)) {
                        return { path: args.path, namespace: 'components' };
                    }
                    return null;
                });

                build.onLoad({ filter: /.*/, namespace: 'components' }, async (args) => {
                    // console.log("resolved", args)
                    const component = components_map.get(args.path);
                    if (component?.type == "mdx") {
                        // console.log("ll", args)
                        const source = components_map.get(args.path)?.source || '';
                        const mkCompiled = await mdcompile(source, {});
                        // console.log("Here------")
                        const compiled = compile(mkCompiled.code, { generate: 'dom' });
                        const finalCode = compiled.js.code.replace('import "svelte/internal/disclose-version";', '');
                        return { contents: finalCode, loader: 'js' };
                    } else {
                        const source = components_map.get(args.path)?.source || '';
                        const compiled = compile(source, { generate: 'dom' });
                        const finalCode = compiled.js.code.replace('import "svelte/internal/disclose-version";', '');
                        return { contents: finalCode, loader: 'js' };
                    }
                    // return { contents: component?.source, namespace: component?.type };
                });

                build.onLoad({ filter: /.*/, namespace: 'cdn' }, async (args) => {
                    const response = await fetch(args.path);
                    return { contents: await response.text() };
                });
            },
        },
    ];
    let isError = false;
    const result = await build({
        entryPoints: ['./markdown.mdx'],
        bundle: true,
        format: 'esm',
        plugins,
        write: false,
    }).catch(e => {
        isError = true
        return {
            outputFiles: [{
                text: `<p>${e.message}</p>`
            }]
        }
    });
    return ({ "data": result.outputFiles[0].text, isError });

}

if (process.env.get_images == "True") {

    console.log("Getting images' name")
    const organizers_names = await fetch(`${backend_url}internal/images/info/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
            "password": process.env.pass
        })
    }).then(res => res.json())
    .then(res => {
        return res.data
    })

    // console.log(organizers_names)
    const result_promises = []
    let i = 0;
    // request to backend in patch of 5
    let no_of_images = organizers_names.length
    while (i < no_of_images) {
        let upto = Math.min(no_of_images, i + 5)
        
        for (let j = i; j < upto; j ++) {
            const name = organizers_names[j];
            
            result_promises.push(
            fetch(`${backend_url}internal/image/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({
                    "name": name,
                    "password": process.env.pass
                })
            }).then(res => {
                // console.log(res)
                return res.json()
            }).catch(err => { return { "status": 500, "message": err.toString() } })
        )
    }
    
    await Promise.all(result_promises).then(results => {
        fs.rmSync("./static/uploads/", { recursive: true, force: true })
        fs.mkdirSync("./static/uploads/", { recursive: true })
        let i = 0;
        for (const res of results) {
            if (res.status == 200) {
                // console.log(res.name)
                const image = res
                try {
                    fs.writeFileSync(path.resolve("./static/uploads/", `${image.name.toLowerCase()}.webp`), Buffer.from(image.image, 'base64'))
                } catch (e) {
                    console.log("Error in file save: " + image + ":" + image.name + " " + e.toString())
                }
            } else {
                console.log("unsuccessful: ",res, i)
            }
            i++
        }
        console.log("5 new images added")
    }).catch(err => {
        console.log(err.toString())
    })    
    i += 5
    
    
}

console.log("Got all images")
}

console.log(process.env.get_events)
if (process.env.get_events == "True") {

    let events_data = await fetch(`${backend_url}/internal/events/all/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
            // "password": process.env.pass
            "password": process.env.pass
        })
    }).then(res => res.json())
    .then(async res => {
        console.log("Got all events")
        if (res.status == 200) {
            return res.data
        } else {
            console.log(res)
            return []
        }
    }).catch(err => {
        console.log(err.toString())
    })
    const events_compiledmap = {}
    const events = {
        'C': { "events": {} },
        "T": { "events": {} },
        "W": { "events": {} },
        "I": { "events": {} }
        
    }
    
    let event_ids = [];
    
    function addEvent(event) {
        event_ids.push(event.eventId)
        const event_data = {
            "name": event.name,
            "id": event.eventId,
            "image": event.image_url,
            "tags": event.tags,
        }
        events[event.eventId.at(0)]['events'][event.eventId] = event_data
    }
    
    function getTaggedEvents(tag) {
        let tagged_events = [];
        for (const event of events_data) {
            if (skip_event.includes(event.eventId)) {
                continue
            }
            if (event.tags[0] == tag || event.tags[1] == tag) {
                tagged_events.push(event)
            }
        }
        return tagged_events;
    }
    
    function mergeEvents(tagged_events) {
        let tags = new Set();
        let noTagEvents = [];
        let closedTagEvents = [];
        let mergedEvents = [];
        for (const event of tagged_events) {
            if (event.tags[1].trim() == "closed"){
                closedTagEvents.push(event)
            } else if (event.tags[1].length != 0) {
                tags.add(event.tags[1])
            } else {
                noTagEvents.push(event);
            }
        }
        for (const tag of tags) {
            for (const event of getTaggedEvents(tag)) {
                mergedEvents.push(event)
            }
        }
        for (const event of noTagEvents) {
            mergedEvents.push(event)
        }
        return [mergedEvents, closedTagEvents];
    }
    let [online_events, closed_online_events ] = mergeEvents(getTaggedEvents("online"));

    let [ offline_events, closed_offline_events ] = mergeEvents(getTaggedEvents("offline"));

    async function fetchEvents(events_data) {
        for (const event of events_data) {
            
            if (event.name.toLowerCase().startsWith("tutorial") || event.name.toLowerCase().startsWith("test")) {
                continue
            }

            // NOTE: Skip events that do not end with the specified YEAR also should we apply it for tagging and merging also?
            if (!(event.eventId.toLowerCase().endsWith(`${YEAR}`))){
                console.log(`Skipping event that does not end with ${YEAR}: ${event.eventId} ${event.name}`);
                continue;
            }
            console.log("Fetching event: " + event.eventId + " " + event.name)
            
            await fetch(`${backend_url}/internal/event/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({
                "id": event.eventId,
                // "password": process.env.pass
                "password": process.env.pass
            })
        }).then(res => res.json())
        .then(async res => {
            if (res.status == 200) {
                addEvent(res)
                if (res.name.startsWith("Digital Painting")) {
                    console.log(res)
                }
                // let markdown = res.markdown.replaceAll("\"./", "\"$lib/mdsvex/")
                const result = await compileasync(res.markdown)
                console.log(event.eventId)
                // events_compiledmap.set(event.eventId, result)
                events_compiledmap[event.eventId] = result
            } else {
                console.log(res)
            }
        })
        .catch(err => {
            console.log(err.toString())
        })
    }
}

    await fetchEvents(online_events);
    await fetchEvents(offline_events);
    await fetchEvents(closed_online_events);
    await fetchEvents(closed_offline_events);

// fetchEvents(events_data);

// console.log(events.T)
// console.log(JSON.stringify(events_compiledmap,null, 2))
fs.writeFileSync('./src/lib/markdown.js', `export const events_compiledmap=${JSON.stringify(events_compiledmap, null, 2)}`)
fs.writeFileSync('./src/lib/new_data.js', `export const events_data=${JSON.stringify(events, null, 2)}; 

export const event_ids=${JSON.stringify(event_ids, null, 2)};`)
}