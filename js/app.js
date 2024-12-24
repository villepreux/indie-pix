
import { mf2 } from "https://cdn.jsdelivr.net/npm/@sterlingwes/microformats-parser@1.4.2/+esm";

const web_url = "https://villepreux.github.io/indie-pix";

function trim_char(string, character) {

    const arr   = Array.from(string);
    const first = arr.findIndex(char => char !== character);
    const last  = arr.reverse().findIndex(char => char !== character);

    return (first === -1 && last === -1) ? '' : string.substring(first, string.length - last);

}

function find_node(node, criteria) {

    if (!!node && !!node.attrs && !!criteria) {

        for (const attr of node.attrs) {

            if (!!criteria.src  && attr.name == "src"  && attr.value == criteria.src)  return node;
            if (!!criteria.url  && attr.name == "url"  && attr.value == criteria.url)  return node;
            if (!!criteria.href && attr.name == "href" && attr.value == criteria.href) return node;
        }
    }

    if (!!node.childNodes) {

        for (const child of node.childNodes)  {

            var found = find_node(child, criteria);
            if (!!found) return found;
        }
    }

    return null;
}

async function fetch_sources() {

    return fetch("index.json").then(response => response.json()).then(async (data) => { 

        for (const source of data.sources) {

            var baseUrl = source.url;

            await fetch(baseUrl).then(response => response.text()).then(html => { 

                var indie_pix = { me: null, feed: [] };
                {   
                    console.log("Parse microformats", "baseUrl", baseUrl);

                    const microformats = mf2(html, { baseUrl: baseUrl, experimental: { textContent: true/*, metaformats: true*/ } });

                    if (!!microformats) {

                        console.log("microformats", { url: baseUrl, microformats: microformats });

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

                                                    var node = find_node(microformats.doc, { src: url });

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
    });
}
    
async function format_album() {

    var masonry_grid_selector = ".masonry";

    function innerContentHeight(item) {
        
        var content = item.innerHTML;
        item.innerHTML = "";
        {
            var temp = document.createElement('div');
            temp.style.padding = 0;
            temp.style.margin  = 0;
            temp.innerHTML = content;

            item.appendChild(temp);
            var itemHeight = window.getComputedStyle(temp).getPropertyValue('height').replace("px","");
            item.removeChild(temp);
        }
        item.innerHTML = content;
    
        return itemHeight;

        }

    async function masonry_element(e, rowGap, rowHeight) {

        var h = innerContentHeight(e);
        var s = Math.max(1, Math.round(h / (rowGap + rowHeight)));
        e.style.gridRowEnd = 'span ' + s;

        return true;

        }

    async function masonry(grid) {
        
        var rowGap    = parseInt(window.getComputedStyle(grid).getPropertyValue('row-gap'));
            rowGap    = (isNaN(rowGap)) ? 16 : ((rowGap <= 0) ? 1 : rowGap);
        var rowHeight = rowGap;

        for (var e of grid.children) { const result = await masonry_element(e, rowGap, rowHeight); }
        
        grid.style.gridAutoRows = '1fr';
        grid.style.gridRowGap   = rowGap + 'px';

        return true;
        
        }
    
    async function apply_masonry_on_grids(mode) { 

        var grids = document.querySelectorAll(masonry_grid_selector);

        if (grids.length > 0) {
            
            if (typeof mode === "undefined") mode = "all";

            if (mode == "first") {

                console.log("APPLY MASONRY ON 1ST GRID");

                const result = await masonry(grids[0]); 
                /*scan_images();*/

            } else if (mode == "others") {

                console.log("APPLY MASONRY EXCEPT ON 1ST GRID");

                var g = 0;

                for (grid of grids) { 

                    if (0 == g++) continue;
                    
                    const result = await masonry(grid);
                    scan_images(); 
                }

            } else {

                console.log("APPLY MASONRY ON ALL GRIDS");

                for (grid of grids) { 
                    
                    const result = await masonry(grid);
                    scan_images();
                }
            }
        }
    }

    return apply_masonry_on_grids("first");
}

addEventListener("DOMContentLoaded", async (event) => {

    await fetch_sources();
    await format_album();
});
