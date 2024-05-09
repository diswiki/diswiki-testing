import { Buffer } from "buffer";
import type { forEachChild } from "typescript";

async function getWikiByID(id: string) { 

}

type githubTreeChild = {path: string, mode: string, type: string, sha: string, size: number, url: string};
type githubFileContent = {sha: string, node_id: string, size: number, content: string, encoding: string};

async function getAllWikis(): Promise<{ id: string; title: string; }[] | []> {
    // TODO: CLEAN THIS ALL UP AND ERROR HANDLING !!
    const repoTreeUrl = "https://api.github.com/repos/diswiki/database/git/trees/main";
    const repoTreeReponse = await fetch(repoTreeUrl)
    const repoTree: {sha: string, url: string, tree: []} = await repoTreeReponse.json(); // TODO: Error handling

    // {path: string, mode: string, type: string, sha: string, size: number, url: string}
    const serversObject = repoTree.tree.find((item: { path: string }) => item.path === 'servers');
    // TODO: Error handling
    
    //@ts-expect-error
    const response = await fetch(serversObject.url);
    const data: {sha: string, url: string, tree: [githubTreeChild]} = await response.json();
    // TODO: Error handling

    async function title(child: any): Promise<string> {
        const childResponse = await fetch(child.url);
        const childData = await childResponse.json();
        const informationObject = childData.tree.find((item: { path: string }) => item.path === 'information.json');
        const informationResponse = await fetch(informationObject!.url);
        const informationData: githubFileContent = await informationResponse.json();
        const content = JSON.parse(Buffer.from(informationData.content, "base64").toString())
        return (content.name).replace(/\s+/g, '-').toLowerCase();
    };

    let wikis = [];
    for (var i = 0; i < data.tree.length; i++) {
        let child = data.tree[i];
        if (child.type === "tree" && !isNaN(parseInt(child.path))) {
            wikis.push({id: child.path, title: await title(child)});
        }
    }
    return wikis;
}

async function getAllWikiTitles(): Promise<{title: string}[] | []> {
    // TODO: CLEAN THIS ALL UP AND ERROR HANDLING !!
    const repoTreeUrl = "https://api.github.com/repos/diswiki/database/git/trees/main";
    const repoTreeReponse = await fetch(repoTreeUrl)
    const repoTree: {sha: string, url: string, tree: []} = await repoTreeReponse.json(); // TODO: Error handling

    // {path: string, mode: string, type: string, sha: string, size: number, url: string}
    const serversObject = repoTree.tree.find((item: { path: string }) => item.path === 'servers');
    // TODO: Error handling
    
    //@ts-expect-error
    const response = await fetch(serversObject.url);
    const data: {sha: string, url: string, tree: [githubTreeChild]} = await response.json();
    // TODO: Error handling

    async function title(child: any) {
        const childResponse = await fetch(child.url);
        const childData = await childResponse.json();
        const informationObject = childData.tree.find((item: { path: string }) => item.path === 'information.json');
        const informationResponse = await fetch(informationObject!.url);
        const informationData: githubFileContent = await informationResponse.json();
        const content = JSON.parse(Buffer.from(informationData.content, "base64").toString())
        return (content.name).replace(/\s+/g, '-').toLowerCase();
    };

    let wikis = [];
    for (var i = 0; i < data.tree.length; i++) {
        let child = data.tree[i];
        if (child.type === "tree" && !isNaN(parseInt(child.path))) {
            wikis.push(await title(child));
        }
    }
    return wikis;
}

async function getAllWikiIDs(): Promise<string[] | []> {
    // TODO: CLEAN THIS ALL UP AND ERROR HANDLING !!
    const repoTreeUrl = "https://api.github.com/repos/diswiki/database/git/trees/main";
    const repoTreeReponse = await fetch(repoTreeUrl)
    const repoTree: {sha: string, url: string, tree: []} = await repoTreeReponse.json(); // TODO: Error handling

    // {path: string, mode: string, type: string, sha: string, size: number, url: string}
    const serversObject = repoTree.tree.find((item: { path: string }) => item.path === 'servers');
    // TODO: Error handling
    
    //@ts-expect-error
    const response = await fetch(serversObject.url);
    const data: {sha: string, url: string, tree: [githubTreeChild]} = await response.json();
    // TODO: Error handling

    let wikis = [];
    for (var i = 0; i < data.tree.length; i++) {
        let child = data.tree[i];
        if (child.type === "tree" && !isNaN(parseInt(child.path))) {
            wikis.push(child.path);
        }
    }
    return wikis;
}

async function returnStaticPaths(): Promise<{params: {wiki: string;}}[] | []> {
    const result = await getAllWikis();
    
    let paths = [];
    for (let i = 0; i < result.length; i++) {
        const res = result[i];
        paths.push({params: {wiki: `${res.id}-${res.title}`}});
    }
    return paths;
}

async function returnStaticPathsID(): Promise<{params: {id: string;}}[] | []> {
    const result = await getAllWikiIDs();

    let paths = [];
    for (var i = 0; i < result.length; i++) {
        let res = result[i];
        paths.push({params: {id: res}});
    }

    return paths;
}

async function returnStaticPathsTitle(): Promise<{params: {title: string;}}[] | []> {
    const result = await getAllWikiTitles();

    let paths = [];
    for (var i = 0; i < result.length; i++) {
        let res = result[i];
        paths.push({params: {title: res.title}});
    }

    return paths;
}

async function returnStaticPathsAsSlug(): Promise<{params: {slug: string;}}[] | []> {
    const result = await getAllWikis();

    let paths = [];
    for (var i = 0; i < result.length; i++) {
        let res = result[i];
        paths.push({params: {slug: `${res.id}/${res.title}`}});
    }

    return paths;
}

async function returnStaticPathsSeparate(): Promise<{params: {id: string; title: string;}}[] | []> {
    const result = await getAllWikis();

    let paths = [];
    for (var i = 0; i < result.length; i++) {
        let res = result[i];
        paths.push({params: {id: res.id, title: res.title}});
    }

    return paths;
}


export {
    getWikiByID,
    getAllWikis,
    returnStaticPaths,
    returnStaticPathsAsSlug,
    returnStaticPathsID,
    returnStaticPathsSeparate,
    returnStaticPathsTitle
};