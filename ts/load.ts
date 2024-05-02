console.log("Waiting for window to load.");

function checkPathnameParts(pathnameParts: string[]): [boolean, number, string] {
    let valid = true;
    let status = 200;
    let message = "All OK.";

    const [first, second, third, ...rest] = pathnameParts;
    if (first !== "wiki") {
        valid = false;
        status = 404;
        message = `The requested resource "${pathnameParts.join('/')}" does not exist!`;
    } else if (!["user", "server"].includes(second)) {
        valid = false;
        status = 404;
        message = `You can only request a user or a server from the wiki, not "${second}"!`;
    } else if ([undefined, ""].includes(third)) {
        valid = false;
        status = 400;
        message = "You must request a resource from the wiki! It cannot be blank.";
    }

    return [valid, status, message];
}


window.addEventListener('load', async () => {
    console.log("DisWiki.");
    const pathnameParts = window.location.pathname.toLowerCase().split('/').slice(1);
    if (["index", "/", ""].includes(pathnameParts[0].split('.')[0])) {
        return;
    }

    const [isPathnameValid, _, pathnameMessage] = checkPathnameParts(pathnameParts);
    if (!isPathnameValid) {
        alert(pathnameMessage);
        return;
    }

    console.log(pathnameParts);

    const baseUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[1]}s/${pathnameParts[2]}`;
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

    } catch (error) {
        alert(error.message);
        console.error(error);
        return;
    }

    console.log(informationData);
    console.log(sidebarData);
    console.log(contentData);
    // TODO: move this to the API, better error handling, and finally create the elements
});


