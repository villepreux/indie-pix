
import { mf2 } from "https://cdn.jsdelivr.net/npm/@sterlingwes/microformats-parser@1.4.2/+esm";

addEventListener("DOMContentLoaded", (event) => {

    fetch("index.json").then(response => response.json()).then(data => { 

        for (const source of data.sources) {

            fetch(source.url).then(html => { 
            
                console.log("Received html", html);
                const parsed = mf2(html);
                console.log("Parsed", parsed);
            });
        }
    });
});