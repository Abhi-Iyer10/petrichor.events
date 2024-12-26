import { compile } from "svelte/compiler";
import { compile as mdcompile } from "mdsvex"
import { build } from 'esbuild';
import fs from "fs"

const CDN_URL = "https://cdn.jsdelivr.net/npm";

const components_map = new Map()


function generate_lookup(components) {
    components.forEach(component => {
        components_map.set(`./${component.name}.${component.type}`, component)
    })
}


export const pre_components = [
    {
        id: 1,
        name : 'Section',
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
        name : 'Box',
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
        name : 'Person',
        type: "svelte",
        source: `<script lang="ts">
    export let name = 'John Doe'
    export let phone = '123-456-7890'
    import { onMount } from "svelte";

    let url = 'https://picsum.photos/200/300'
    let origin = "https://finance-petrichor.vercel.app"

     onMount(() => {
        if (window.top.location.origin)
            origin = window.top.location.origin
    
        // img_div = document.getElementById("back_bg") as HTMLDivElement;
        if (phone != '123-456-7890') {
            url = \`\${origin}/uploads/\${name.toLowerCase()}.png\`
        }

        if (origin ==  "https://finance-petrichor.vercel.app" || origin == "http://localhost:5173"){
            fetch('https://petri-back.vercel.app/internal/image/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({
                    "name":name,
                    "password": process.env.pass
                })
            }).then(res => res.json())
            .then(res => {
                const imageURL = \`data:image/png;base64,\${res.image}\`;
                url = \`\${imageURL}\`;
            })
        }
    })
</script>

<div class="main">
    <div class="backpic" id="back_bg" style="background-image: url('{url}');">
    </div>
    <h2>{name}</h2>
    <p>{phone}</p>
</div>


<style>
    .main{
        background-color: rgb(27, 27, 27, 0.5);
        backdrop-filter: blur(12px);
        font-family: var(--pfont);
        width: min-content;
        margin: 1em;
        border-radius: 1em;
        overflow: hidden;
        width: 14em;
    }
    .backpic{
        background-size: cover;
        background-position: center;
        position: relative;
        height: 12em;
        width: 12em;
        border-radius: 0.4em;
        margin: 1rem;
        background-repeat: no-repeat;
    }
    h2{
        font-family: var(--pfont);
        margin-left: 1rem;
        width: max-content;
        /* color: black; */
    } 
    p{
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        letter-spacing: 0.05em;
        margin: 1rem;
        margin-top: -0.5rem;
        overflow: hidden;
        width: fit-content;
        text-align: center;
        border-radius: 0 0 0.4em 0.4em;
    }
</style>`
    },
    {
        id: 1,
        name : 'FlexSection',
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
        name : 'CenterSection',
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
    }
</style>`
    }
    ,{
        id: 1,
        name : 'Button',
        type: "svelte",
        source: `<script lang="ts">
    export let url = "#rules";
	function handleClick() {
		if (url.startsWith("#")) {
			const rulesElement = document.getElementById(url.replace('#', ""));
			if (rulesElement) {
				rulesElement.scrollIntoView({ behavior: 'smooth' });
				rulesElement.focus(); // Optionally focus the element
			}
		} else {
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
	.buttons > button {
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
		border: unset;
		color: white;
		font-size: 20px;
		transition: 200ms ease-in-out;
	}
	.register:hover {
		background-color: rgb(255, 255, 255);
		color: black;
	}
        @media (max-width: 600px) {
            .register {
			display: block;
			margin-bottom: 1em;
			text-align: center;
		}
            .buttons {
            margin-bottom: 0px;
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
                outputFiles:[{
                    text: `<p>${e.message}</p>`
                }]
            }
        });
    return ({"data":result.outputFiles[0].text, isError});

}

let events_data = await fetch('https://petri-back.vercel.app/internal/events/all/', {
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

for (const event of events_data) {
    await fetch('https://petri-back.vercel.app/internal/event/', {
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
        if (res.status == 200){
            // let markdown = res.markdown.replaceAll("\"./", "\"$lib/mdsvex/")
            const result = await compileasync(res.markdown) 
            console.log(event.eventId)
            // events_compiledmap.set(event.eventId, result)
            events_compiledmap[event.eventId] =  result
        }
    })
    .catch(err => {
        console.log(err.toString())
    })
}
// console.log(JSON.stringify(events_compiledmap,null, 2))
fs.writeFileSync('./src/lib/markdown.js', `export const events_compiledmap=${JSON.stringify(events_compiledmap,null, 2)}`)

await fetch('https://petri-back.vercel.app/internal/images/all/', {
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
.then(async res => {
    console.log("Got all images")
    if  (res.status == 200) {

        for (const image of res.data) {
            try {
                fs.writeFileSync(path.resolve("./static/uploads/",`${image.name.toLowerCase()}.png`),Buffer.from(image.image,'base64'))
            } catch(e) {
                console.log("Erro in file save: " + image)
            }
        }
    } else {
        console.log(res)
    }
    return res.data
}).catch(err => {
    console.log(err.toString())
})