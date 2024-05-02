
class Routes {
    async root(pathnameParts: string[]): Promise<void> {
        console.log("root callback");
    }
    async wiki(pathnameParts: string[]): Promise<[boolean, Record<string, unknown>, Record<string, unknown>, string]> {
        console.log("wiki callback");

        const baseUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[0]}s/${pathnameParts[1]}`;
        let informationData: Record<string, unknown> = {};
        let sidebarData: Record<string, unknown> = {};
        let contentData = "";

        try {
            const fetchData = async (endpoint: string) => {
                const response = await fetch(`${baseUrl}/${endpoint}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`${pathnameParts[1]} with id ${pathnameParts[2]} could not be found!`);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                }
                return response;
            };

            const [informationResponse, sidebarResponse, contentResponse] = await Promise.all([
                fetchData('information.json'),
                fetchData('sidebar.json'),
                fetchData('content.md')
            ]);

            informationData = await informationResponse.json();
            sidebarData = await sidebarResponse.json();
            contentData = await contentResponse.text();

        } catch (error: any) {
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
    }
}


async function route(mappings: { path: string; callback: any; }[], pathname: string, pathnameParts: string[]): Promise<boolean> {
    let validRoute = false;
    for (let i = 0; i < mappings.length; i++) {
        // TODO: Fix.
        console.log(`Routing -> ${mappings[i].path} : ${pathname}`);
        const route = mappings[i].path;
        if (route.endsWith("*")) {
            const prefix = route.slice(0, -1);
            if (pathname.startsWith(prefix)) {
                validRoute = true;
                await mappings[i].callback(pathnameParts);
                break;
            }
        } else if (route === pathname) {
            validRoute = true;
            await mappings[i].callback(pathnameParts);
            break;
        }
    }

    if (!validRoute) {
        let httpCat = document.createElement('img');
        httpCat.src = "https://http.cat/404.jpg";
        document.body.appendChild(httpCat);
    }

    return validRoute;
}

export {
    Routes,
    route
}