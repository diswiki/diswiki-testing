var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Routes, route } from "./routing";
console.log("Waiting for window to load.");
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
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
    let routeResult = yield route(mappings, pathname, pathnameParts);
    if (!routeResult) {
        return;
    }
    // server/975974400941756416
    console.log(pathnameParts);
}));
