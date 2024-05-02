var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Waiting for window to load.");
function checkPathnameParts(pathnameParts) {
    let valid = true;
    let status = 200;
    let message = "All OK.";
    const [first, second, third, ...rest] = pathnameParts;
    if (first !== "wiki") {
        valid = false;
        status = 404;
        message = `The requested resource "${pathnameParts.join('/')}" does not exist!`;
    }
    else if (!["user", "server"].includes(second)) {
        valid = false;
        status = 404;
        message = `You can only request a user or a server from the wiki, not "${second}"!`;
    }
    else if ([undefined, ""].includes(third)) {
        valid = false;
        status = 400;
        message = "You must request a resource from the wiki! It cannot be blank.";
    }
    return [valid, status, message];
}
class Routes {
    root(pathnameParts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("root callback");
        });
    }
    wiki(pathnameParts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("wiki callback");
            // TODO: Fix this since there is an actual router now.
            const [isPathnameValid, _, pathnameMessage] = checkPathnameParts(pathnameParts);
            if (!isPathnameValid) {
                alert(pathnameMessage);
                return;
            }
            const baseUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[1]}s/${pathnameParts[2]}`;
            let informationData = {};
            let sidebarData = {};
            let contentData = "";
            try {
                const fetchData = (endpoint) => __awaiter(this, void 0, void 0, function* () {
                    const response = yield fetch(`${baseUrl}/${endpoint}`);
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(`${pathnameParts[1]} with id ${pathnameParts[2]} could not be found!`);
                        }
                        else {
                            throw new Error('Failed to fetch data');
                        }
                    }
                    return response;
                });
                const [informationResponse, sidebarResponse, contentResponse] = yield Promise.all([
                    fetchData('information.json'),
                    fetchData('sidebar.json'),
                    fetchData('content.md')
                ]);
                informationData = yield informationResponse.json();
                sidebarData = yield sidebarResponse.json();
                contentData = yield contentResponse.text();
            }
            catch (error) {
                alert(error.message);
                console.error(error);
                return;
            }
            console.log(informationData);
            console.log(sidebarData);
            console.log(contentData);
        });
    }
}
window.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
    console.log("DisWiki.");
    const pathname = window.location.pathname.toLowerCase();
    const pathnameParts = window.location.pathname.toLowerCase().split('/').slice(1);
    const routes = new Routes();
    // TODO: Account for variable paths
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
            "path": "/wiki",
            "callback": routes.wiki
        }
    ];
    let validRoute = false;
    for (let i = 0; i < mappings.length; i++) {
        console.log(`Routing -> ${mappings[i].path} : ${pathname}`);
        const route = mappings[i].path;
        if (route.endsWith("*")) {
            const prefix = route.slice(0, -1);
            if (pathname.startsWith(prefix)) {
                validRoute = true;
                const wildcardValue = pathname.slice(prefix.length);
                yield mappings[i].callback(pathnameParts);
                break;
            }
        }
        else if (route === pathname) {
            validRoute = true;
            yield mappings[i].callback(pathnameParts);
            break;
        }
    }
    // for (var i = 0; i < mappings.length; i++) {
    //     console.log(`Routing -> ${mappings[i].path} : ${pathname}`);
    //     if (mappings[i].path === pathname) {
    //         validRoute = true;
    //         await mappings[i].callback(pathnameParts);
    //         break;
    //     }
    // }
    if (!validRoute) {
        let httpCat = document.createElement('img');
        httpCat.src = "https://http.cat/404.jpg";
        document.body.appendChild(httpCat);
    }
    // user/975974400941756416
    console.log(pathnameParts);
}));
