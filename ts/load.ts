import { Routes, route } from "./wikiRouting";

console.log("Waiting for window to load.");

window.addEventListener('load', async () => {
    console.log("DisWiki.");
    const pathname = window.location.pathname.toLowerCase();
    const pathnameParts = window.location.pathname.toLowerCase().split('/').slice(1);
    const routes = new Routes();

    const mappings = [
        {
            "path": "/", // Doesnt work in this configuration, however, it will later.
            "callback": routes.root
        },
        {
            "path": "/index",
            "callback": routes.root
        },
        {
            "path": "",
            "callback": routes.root
        },
        {
            "path": "/server/*",
            "callback": routes.wiki
        },
        {
            "path": "/user/*",
            "callback": routes.wiki
        }
    ];

    let routeResult = await route(mappings, pathname, pathnameParts);
    if (!routeResult) { return; }

    // server/975974400941756416

    console.log(pathnameParts);
});


