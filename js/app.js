
import { mf2 } from "https://cdn.jsdelivr.net/npm/@sterlingwes/microformats-parser@1.4.2/+esm";

const web_url = "https://villepreux.github.io/indie-pix";

async function fetch_sources() {

    function trim_char(string, character) {

        const arr   = Array.from(string);
        const first = arr.findIndex(char => char !== character);
        const last  = arr.reverse().findIndex(char => char !== character);
    
        return (first === -1 && last === -1) ? '' : string.substring(first, string.length - last);
    
    }
    
    function find_node_by_attribute(node, criteria) {
    
        if (!!node && !!node.attrs && !!criteria) {
    
            for (const attr of node.attrs) {
    
                if (criteria.name == attr.name && criteria.value == attr.value) {
    
                    return node;
                }
            }
        }
    
        if (!!node.childNodes) {
    
            for (const child of node.childNodes)  {
    
                var found = find_node_by_attribute(child, criteria);
                if (!!found) return found;
            }
        }
    
        return null;
    }
    
    return fetch("index.json").then(response => response.json()).then(async (data) => { 

        for (const source of data.sources) {

            var baseUrl  = source.url;
            var response = null;

            try {

                response = await fetch(baseUrl).then(response => { 

                    if (response.ok) {
                        
                        response.text().then(html => { 

                            var indie_pix = { me: null, feed: [] };
                            {   
                                const microformats = mf2(html, { baseUrl: baseUrl, experimental: { textContent: true/*, metaformats: true*/ } });
        
                                if (!!microformats) {
        
                                    console.log("microformats", { url: baseUrl, microformats: microformats });
        
                                    if (!!microformats.rels && !!microformats.rels.me)
                                    {
                                        var me_url = trim_char(web_url, "/") + "/@";

                                        console.log("Looking for", me_url);
                                        console.log("Scanning", microformats.rels.me);

                                        for (const me of microformats.rels.me) {
        
                                            if (0 == me.indexOf(me_url)) {
        
                                                indie_pix.me = me;
                                                break;
                                            }
                                        }
        
                                        if (!!indie_pix.me) {
        
                                            var feed = null;
        
                                            if (!!microformats.items) {
        
                                                for (const item of microformats.items) {
        
                                                    if (!!item.type && item.type == "h-feed") {
        
                                                        feed = item;
                                                        break;
                                                    }
                                                }
                                            }
        
                                            if (!!feed) {
        
                                                if (!!feed.children) {
        
                                                    for (const child of feed.children) {
                
                                                        if (!!child.type && child.type == "h-entry"
                                                        &&  !!child.properties &&  (!!child.properties.url || !!child.properties.photo)) {
        
                                                            var url = null;
                                                            {
                                                                if (!!child.properties.photo) {
        
                                                                    if (Array.isArray(child.properties.photo)) {
        
                                                                        for (const img of child.properties.photo) {
        
                                                                            if (!!img.value) {
        
                                                                                url = img.value;
                                                                                break;
                                                                            }
                                                                        }
        
                                                                    } else {
        
                                                                        url = child.properties.photo;
                                                                    }
                                                                }
        
                                                                if (!url) {
                                                                    
                                                                    url = child.properties.url;
                                                                }
                                                            }
        
                                                            if (!!url) {
        
                                                                var feed = { url: url };
        
                                                                var node = find_node_by_attribute(microformats.doc, { name: "src", value: url });
        
                                                                if (!!node) {
                                                                                                            
                                                                    for (const attr of node.attrs) {
        
                                                                        if (attr.name == "width")  feed.width  = attr.value;
                                                                        if (attr.name == "height") feed.height = attr.value;
                                                                        if (attr.name == "alt")    feed.alt    = attr.value;
                                                                    }
                                                                }
                
                                                                indie_pix.feed.push(feed); 
                                                            }
                                                        }
                                                    }
                                                }
                
                                            } else {
        
                                                console.log("Could not find any indie-pix h-feed item");
                                            }
        
                                        } else {
        
                                            console.log("Could not find any indie-pix rel-me");
                                        }
                                    }
                                }
                            }
        
                            console.log("indie-pix", indie_pix);
        
                            var feed = document.querySelector("#feed");
        
                            var i = 0;
        
                            for (const photo of indie_pix.feed) {
        
                                ++i;
        
                                var a = document.createElement("a");
                                {
                                    var img = document.createElement("img");
                                    {
                                        img.src = photo.url;
        
                                        img.alt    = !!photo.alt    ? photo.alt    : "Photo";
                                        img.width  = !!photo.width  ? photo.width  : 3200;
                                        img.height = !!photo.height ? photo.height : 1800;
        
                                        if (!!img.width) {
        
                                            img.style.setProperty("--width",  img.width);
                                            img.style.setProperty("--height", img.height);
                                        }
                                    }
        
                                    a.id = "photo-"+i;
                                    a.href = "#"+a.id;
                                    a.classList.add("photo");
                                    a.classList.add("h-entry");
        
                                    if (!!img.width) {
        
                                        a.style.setProperty("--width",  img.width);
                                        a.style.setProperty("--height", img.height);
                                    }
        
                                    a.appendChild(img);
                                }
        
                                feed.appendChild(a);
                            }
                        });
                    }
                })

            } catch {

                console.error('Exception while fetching ' + baseUrl);
                continue;
            }
        }
    });
}

addEventListener("DOMContentLoaded", async (event) => {

    /* Load all sources */

    await fetch_sources();

    /* As a progressive enhancement, clicking an enlarged image shrinks it */

    document.querySelectorAll(".album a.photo").forEach((a) => {

        a.addEventListener("click", (event) => {

            window.location = a.href;

            if (a.classList.contains("fullscreen")) {

                event.preventDefault();
                
                a.classList.remove("fullscreen");
                a.style.cursor = "zoom-in";
                window.location = "#";
            
            } else {

                a.classList.add("fullscreen");
                a.style.cursor = "zoom-out";
            }
        });
    });
});
