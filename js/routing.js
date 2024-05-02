var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Routes {
    root(pathnameParts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("root callback");
        });
    }
    wiki(pathnameParts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("wiki callback");
            const baseUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[0]}s/${pathnameParts[1]}`;
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
                return [false, {}, {}, ""];
            }
            console.log(informationData);
            console.log(sidebarData);
            console.log(contentData);
            return [
                true,
                informationData,
                sidebarData,
                contentData
            ];
        });
    }
}
function route(mappings, pathname, pathnameParts) {
    return __awaiter(this, void 0, void 0, function* () {
        let validRoute = false;
        for (let i = 0; i < mappings.length; i++) {
            // TODO: Fix.
            console.log(`Routing -> ${mappings[i].path} : ${pathname}`);
            const route = mappings[i].path;
            if (route.endsWith("*")) {
                const prefix = route.slice(0, -1);
                if (pathname.startsWith(prefix)) {
                    validRoute = true;
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
        if (!validRoute) {
            let httpCat = document.createElement('img');
            httpCat.src = "https://http.cat/404.jpg";
            document.body.appendChild(httpCat);
        }
        return validRoute;
    });
}
export { Routes, route };
