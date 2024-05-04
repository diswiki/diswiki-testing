import { showError, showFixedHeader } from "../helpers/errors";
import { RouteControllerTemplate } from "../wikiRouting";
import { PageData } from "../helpers/types";
import DOMPurify from 'dompurify';
import { Marked } from "@ts-stack/markdown";
import { fetchServerIconUrl } from "../helpers/discord";

class WikiController implements RouteControllerTemplate {
    async start(pathnameParts: string[]): Promise<void> {
        console.log("wiki callback");

        const baseUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[0]}s/${pathnameParts[1]}`;
        let informationData: Record<string, unknown> = {};
        let sidebarData: Record<string, unknown> = {};
        let contentData = "";
        let template = "";

        try {
            const fetchData = async (endpoint: string) => {
                const response = await fetch(`${baseUrl}/${endpoint}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(
                            `${pathnameParts[0]} with id ${pathnameParts[1]} could not be found!`
                        );
                    } else {
                        throw new Error("Failed to fetch data");
                    }
                }
                return response;
            };

            const [informationResponse, sidebarResponse, contentResponse] =
                await Promise.all([
                    fetchData("information.json"),
                    fetchData("sidebar.json"),
                    fetchData("content.md"),
                ]);

            informationData = await informationResponse.json();
            sidebarData = await sidebarResponse.json();
            contentData = await contentResponse.text();
        } catch (error: any) {
            console.error(error);
            await showError(404);
            return;
        }

        // console.log(informationData);
        // console.log(sidebarData);
        // console.log(contentData);



        try {
            const templateReponse = await fetch("https://raw.githubusercontent.com/diswiki/resources/main/templates/wiki.html");
            if (!templateReponse.ok) {
                if (templateReponse.status === 404) {
                    throw new Error(
                        `${pathnameParts[0]} template could not be found!`
                    );
                } else {
                    throw new Error("Failed to fetch template");
                }
            }
            template = await templateReponse.text();

        } catch (error: any) {
            console.error(error);
            await showError(500);
            return;
        }

        if (pathnameParts[0] === "server") {
            this.displayServerPage([informationData, sidebarData, contentData], template);
        } else if (pathnameParts[0] === "user") {
            this.displayUserPage([informationData, sidebarData, contentData], template);
        } else {
            await showError(500);
        }
    }

    private async displayServerPage(pageData: PageData, template: string): Promise<void> {
        const [informationData, sidebarData, contentData] = pageData;
        const contentDiv = document.getElementById("content");
        if (contentDiv == null) {
            console.error("Content div does not exist. Nowhere to place content.");
            await showError(500);
            return;
        }

        contentDiv.innerHTML = template.trim();

        const wikiHeader = document.getElementById("wiki-header");
        const wikiToc = document.getElementById("wiki-toc");
        const wikiContent = document.getElementById("wiki-content");
        const wikiSidebar = document.getElementById("wiki-sidebar");
        const wikiSidebarTitle = document.getElementById("wiki-sidebar-title");
        const wikiSidebarServerIcon = document.getElementById("wiki-sidebar-server-icon");
        if ([wikiHeader, wikiToc, wikiContent, wikiSidebar, wikiSidebarTitle, wikiSidebarServerIcon].includes(null)) {
            console.error("A piece of the wiki is missing.");
            await showFixedHeader("A piece of the wiki is missing, the wiki may not look complete.");
            return;
        }

        wikiContent!.innerHTML = DOMPurify.sanitize(Marked.parse(contentData));
        wikiHeader!.textContent = informationData.name as string;
        wikiSidebarTitle!.textContent = informationData.name as string;

        const url = `https://discord.com/invite/${informationData.invite}`;
        const invite = url.substring(url.lastIndexOf('/') + 1);
        const serverIconUrl = await fetchServerIconUrl(invite);

        wikiSidebarServerIcon?.setAttribute("src", serverIconUrl);

    }

    private async displayUserPage(pageData: PageData, template: string): Promise<void> {
        alert("displayUserPage");
    }
}


export {
    WikiController
}
