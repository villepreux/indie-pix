
import { mf2 } from "https://cdn.jsdelivr.net/npm/@sterlingwes/microformats-parser@1.4.2/+esm";

const web_url = "https://villepreux.github.io/indie-pix";

function trim_char(string, character) {

    const arr   = Array.from(string);
    const first = arr.findIndex(char => char !== character);
    const last  = arr.reverse().findIndex(char => char !== character);

    return (first === -1 && last === -1) ? '' : string.substring(first, string.length - last);
}

addEventListener("DOMContentLoaded", (event) => {

    fetch("index.json").then(response => response.json()).then(data => { 

        for (const source of data.sources) {

            var url = source.url;

            fetch(url).then(response => response.text()).then(html => { 

                var indie_pix = { me: null, feed: [] };
                {            
                    const microformats = mf2(html, { baseUrl: url, experimental: { textContent: true/*, metaformats: true*/ } });

                    if (!!microformats) {

                        console.log("microformats", { url: url, microformats: microformats });

                        if (!!microformats.rels && !!microformats.rels.me)
                        {
                            for (const me of microformats.rels.me) {

                                if (0 == me.indexOf(trim_char(web_url, "/") + "/@")) {

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
    
                                                indie_pix.feed.push(!!child.properties.photo ? child.properties.photo : child.properties.url);
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

                for (const url of indie_pix.feed) {

                    var img = document.createElement("img");
                    img.src = url;
                    feed.appendChild(img);
                }
            });
        }
    });
});