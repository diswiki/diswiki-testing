import { showError, showFixedHeader } from "../helpers/errors";
import { RouteControllerTemplate } from "../wikiRouting";
import { PageData } from "../helpers/types";
import DOMPurify from "dompurify";
import { Marked } from "@ts-stack/markdown";
import { fetchServerDetails } from "../helpers/discord";
import { WikiElements } from "../helpers/interfaces";
import { server } from "../../node_modules/typescript/lib/typescript";
import { formatTimestamp, timeSinceTimestamp } from "../helpers/time";
import { truncate, slugify } from "../helpers/text";

class WikiImage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const placement = this.getAttribute('placement') || 'left';
        let size = this.getAttribute('size') || 150;
        const file = this.getAttribute('file') || '';
        const caption = this.textContent || '';

        this.textContent = '';

        if (!['left', 'right', 'break'].includes(placement)) {
            throw new Error('Invalid placement. Only "left", "right", and "break" are allowed.');
        }

        size = parseInt(size as string);

        if (isNaN(size) || !isFinite(size)) {
            size = 150;
        }

        const pathnameParts = window.location.pathname.toLowerCase().split('/').slice(1);


        const imageUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[0]}s/${pathnameParts[1]}/assets/${file}`;
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = caption;
        img.width = size;
        img.style.borderRadius = '5px';

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.padding = '5px';

        const p = document.createElement('p');
        p.textContent = caption;
        p.style.textAlign = 'center';
        p.style.fontSize = '.8rem';

        div.appendChild(img);
        div.appendChild(p);
        this.appendChild(div);

        if (placement === 'break') {
            div.style.alignItems = 'center';
        } else if (placement === 'right') {
            div.style.width = 'min-content';
            this.style.display = 'inline-block';
            this.style.width = 'min-content';
            this.style.float = 'right';
        } else {
            div.style.width = 'min-content';
            this.style.display = 'inline-block';
            this.style.width = 'min-content';
            this.style.float = 'left';
        }
    }
}


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

        try {
            const templateReponse = await fetch(
                "https://raw.githubusercontent.com/diswiki/resources/main/templates/wiki.html"
            );
            if (!templateReponse.ok) {
                if (templateReponse.status === 404) {
                    throw new Error(`${pathnameParts[0]} template could not be found!`);
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

        this.displayWikiPage([informationData, sidebarData, contentData], pathnameParts[0], pathnameParts[1], template);
    }

    private async displayWikiPage(
        pageData: PageData,
        pageType: string,
        id: string,
        template: string
    ): Promise<void> {
        const [informationData, sidebarData, contentData] = pageData;
        console.log(informationData);
        const contentDiv = document.getElementById("content");
        if (contentDiv == null) {
            console.error("Content div does not exist. Nowhere to place content.");
            await showError(500);
            return;
        }

        customElements.define('wiki-image', WikiImage);

        contentDiv.innerHTML = template.trim();

        const wikiElements: WikiElements = {
            tableOfContents: document.getElementById("wiki-toc"),
            pageTitle: document.getElementById("wiki-page-title"),
            lastEdited: document.getElementById("wiki-last-edited"),
            readTime: document.getElementById("wiki-read-time"),
            likeCount: document.getElementById("wiki-like-count"),
            shareCount: document.getElementById("wiki-share-count"),
            content: document.getElementById("wiki-content"),

            serverIcon: document.getElementById("wiki-sidebar-server-icon"),
            memberCount: document.getElementById("wiki-sidebar-members"),
            membersOnline: document.getElementById("wiki-sidebar-online"),
            serverCreation: document.getElementById("wiki-sidebar-server-creation"),
            serverAge: document.getElementById("wiki-sidebar-server-age"),
            serverID: document.getElementById("wiki-sidebar-server-id"),
            serverOwner: document.getElementById("wiki-sidebar-server-owner"),

            wikiOwner: document.getElementById("wiki-sidebar-wiki-owner"),
            wikiAdminsRow: document.getElementById("wiki-sidebar-wiki-admins-row"),
            wikiCreation: document.getElementById("wiki-sidebar-wiki-creation"),

            actionLike: document.getElementById("wiki-action-like"),
            actionShare: document.getElementById("wiki-action-share"),
            actionReport: document.getElementById("wiki-action-report"),
            joinButton: document.getElementById("wiki-join"),
        };

        if (!Object.keys(wikiElements).every((key) => !!wikiElements[key])) {
            console.error("A piece of the wiki is missing.");
            await showFixedHeader(
                "A piece of the wiki is missing, the wiki may not look complete."
            );
        }

        const avgReadTime = (text: string) => {
            const wpm = 225;
            const words = text.trim().split(/\s+/).length;
            const time = Math.ceil(words / wpm);
            return time;
        };

        const allowedTags = [
            "wiki-user",
            "wiki-channel",
            "wiki-image",
            "pre",
            "code",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "br",
            "p",
            "a",
            "tbody",
            "table",
            "tr",
            "th",
            "td",
            "img",
            "i",
            "em",
            "b",
            "strong",
            "u",
            "ol",
            "ul",
            "li"
        ];
        const allowedAttr = [
            "file",
            "placement",
            "caption",
            "size"
        ];

        const serverInfo = await fetchServerDetails(informationData.invite as string);


        wikiElements.pageTitle!.textContent = informationData.name as string;

        wikiElements.content!.innerHTML = DOMPurify.sanitize(
            Marked.parse(contentData),
            {
                ALLOWED_TAGS: allowedTags,
                ADD_ATTR: allowedAttr
            }
        );

        // wikiElements.content!.innerHTML = Marked.parse(contentData);

        wikiElements.likeCount!.textContent = `${informationData.likes} ${informationData.likes === 1 ? 'like' : 'likes'}`;
        wikiElements.shareCount!.textContent = `${informationData.shares} ${informationData.shares === 1 ? 'share' : 'shares'}`;
        wikiElements.readTime!.textContent = `${avgReadTime(
            contentData
        )} minute read`;

        let leTime = formatTimestamp(informationData.last_updated as number, "relative");
        wikiElements.lastEdited!.textContent = `Last Edited: ${leTime}`;
        wikiElements.lastEdited!.setAttribute('data-tooltip', formatTimestamp(informationData.last_updated as number, "normaltime"));

        wikiElements.serverIcon!.setAttribute('src', serverInfo.icon);
        wikiElements.memberCount!.textContent = serverInfo.members.toString();
        wikiElements.membersOnline!.textContent = serverInfo.online.toString();

        //@ts-ignore
        wikiElements.serverCreation!.textContent = formatTimestamp(informationData.creation.server, "normal");

        //@ts-ignore
        let [daysSince, monthsSince, yearsSince] = timeSinceTimestamp(informationData.creation.server);
        let timeSince = `${daysSince} ${daysSince === 1 ? 'day' : 'days'}`;
        if (daysSince > 180) {
            timeSince = `${monthsSince} ${monthsSince === 1 ? 'month' : 'months'}`;
        }

        if (monthsSince >= 12) {
            timeSince = `${yearsSince} ${yearsSince === 1 ? 'year' : 'years'}`;
        }
        wikiElements.serverAge!.textContent = timeSince.toString();
        wikiElements.serverAge!.setAttribute('data-tooltip', `${daysSince} ${daysSince === 1 ? 'day' : 'days'} or ${monthsSince} ${monthsSince === 1 ? 'month' : 'months'} or ${yearsSince} ${yearsSince === 1 ? 'year' : 'years'}`);

        //@ts-ignore
        wikiElements.serverID!.textContent = truncate(informationData.server.toString(), 10);
        wikiElements.serverID!.setAttribute('data-tooltip', informationData.server as string);

        const serverOwnerUser = document.createElement('wiki-user');
        const serverOwnerUserAnchor = document.createElement('a');

        //@ts-ignore
        const servOwnerId = informationData.auth.server_owner.toString();
        serverOwnerUserAnchor.textContent = truncate(servOwnerId, 10);
        serverOwnerUserAnchor.target = '_blank';
        //@ts-ignore
        serverOwnerUserAnchor.href = `/user/${informationData.auth.server_owner.toString()}`;
        serverOwnerUser.appendChild(serverOwnerUserAnchor);
        const serverOwnerParent = wikiElements.serverOwner!.parentElement!;
        serverOwnerParent.removeChild(wikiElements.serverOwner!);
        serverOwnerParent.appendChild(serverOwnerUser);
        serverOwnerParent.id = "wiki-sidebar-server-owner";
        serverOwnerParent.setAttribute('data-tooltip', servOwnerId);



        const wikiOwnerUser = document.createElement('wiki-user');
        const wikiOwnerUserAnchor = document.createElement('a');

        //@ts-ignore
        const wikiOwnerId = informationData.auth.wiki_owner.toString();
        wikiOwnerUserAnchor.textContent = truncate(wikiOwnerId, 10);
        wikiOwnerUserAnchor.target = '_blank';
        //@ts-ignore
        wikiOwnerUserAnchor.href = `/user/${informationData.auth.wiki_owner}`;
        wikiOwnerUser.appendChild(wikiOwnerUserAnchor);
        const wikiOwnerParent = wikiElements.wikiOwner!.parentElement!;
        wikiOwnerParent.removeChild(wikiElements.wikiOwner!);
        wikiOwnerParent.appendChild(wikiOwnerUser);
        wikiOwnerParent.id = "wiki-sidebar-wiki-owner";
        wikiOwnerParent.setAttribute('data-tooltip', wikiOwnerId);


        //@ts-ignore
        const wikiAdmins = informationData.auth.wiki_admins;

        if (wikiAdmins.length > 0) {
            let adminTd = wikiElements.wikiAdminsRow?.children[1];
            console.log(`admintd: ${adminTd}`);
            adminTd!.innerHTML = '';
            for (let i = 0; i < wikiAdmins.length; i++) {
                let admin = wikiAdmins[i];
                let adminEl = document.createElement('wiki-user');
                let adminElAnchor = document.createElement('a');

                adminElAnchor.textContent = truncate(admin, 10);
                adminElAnchor.href = `/user/${admin}`;
                adminElAnchor.target = '_blank';
                adminEl.appendChild(adminElAnchor);
                adminEl.classList.add('js-has-tooltip');
                adminEl.setAttribute('data-tooltip', admin);

                adminTd?.appendChild(adminEl);
            }
        } else {
            wikiElements.wikiAdminsRow?.remove();
        }


        //@ts-ignore
        wikiElements.wikiCreation!.textContent = formatTimestamp(informationData.creation.wiki, "normal");
        wikiElements.wikiCreation!.classList.add('js-has-tooltip');
        //@ts-ignore
        wikiElements.wikiCreation!.setAttribute('data-tooltip', formatTimestamp(informationData.creation.wiki, "normaltime"));



        // Actions
        wikiElements.joinButton!.setAttribute('href', `https://discord.gg/${informationData.invite}`);

        // TODO: Optimize



        // Function to convert a string to a valid ID format
        function toValidId(str: string) {
            return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }

        // Function to create a unique ID based on existing IDs
        function getUniqueId(id: any, existingIds: any) {
            let newId = id;
            let count = 2;
            while (existingIds.has(newId)) {
                newId = `${id}-${count}`;
                count++;
            }
            return newId;
        }

        // Function to create the table of contents
        // function createTableOfContents() {
        //     const content = wikiElements.content!;
        //     const toc = wikiElements.tableOfContents!;
        //     const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        //     const existingIds = new Set<string>();

        //     let currentList: HTMLElement = toc;
        //     let currentHeaderLevel: number = 1;
        //     let summaryDetails: HTMLElement | null = null;

        //     headers.forEach(header => {
        //         if (header.id === 'to-top') return;

        //         const id = toValidId(header.textContent!);
        //         const uniqueId = getUniqueId(id, existingIds);
        //         existingIds.add(uniqueId);

        //         const link = document.createElement('a');
        //         link.href = `#${uniqueId}`;
        //         link.textContent = header.textContent!;

        //         const listItem = document.createElement('li');
        //         listItem.appendChild(link);

        //         const headerLevel = parseInt(header.tagName.substring(1));

        //         if (headerLevel === currentHeaderLevel) {
        //             currentList.appendChild(listItem);
        //         } else if (headerLevel > currentHeaderLevel) {
        //             const ol = document.createElement('ol');
        //             currentList.lastElementChild!.appendChild(ol);
        //             currentList = ol;
        //             currentList.appendChild(listItem);
        //             currentHeaderLevel = headerLevel;
        //         } else {
        //             while (currentHeaderLevel > headerLevel) {
        //                 currentList = currentList.parentElement!.parentElement as HTMLElement;
        //                 currentHeaderLevel--;
        //             }
        //             currentList.appendChild(listItem);
        //         }

        //         header.id = uniqueId;
        //     });
        // }


        // function createTableOfContents() {
        //     const content = wikiElements.content!;
        //     const toc = wikiElements.tableOfContents!;
        //     const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        //     const existingIds = new Set<string>();

        //     let currentList: HTMLElement = toc;
        //     let currentHeaderLevel: number = 1;
        //     let lastListItem: HTMLElement | null = null;

        //     headers.forEach(header => {

        //         const id = toValidId(header.textContent!);
        //         const uniqueId = getUniqueId(id, existingIds);
        //         existingIds.add(uniqueId);

        //         const link = document.createElement('a');
        //         link.href = `#${uniqueId}`;
        //         link.textContent = header.textContent!;

        //         const listItem = document.createElement('li');
        //         listItem.appendChild(link);

        //         const headerLevel = parseInt(header.tagName.substring(1));

        //         if (headerLevel === currentHeaderLevel) {
        //             currentList.appendChild(listItem);
        //         } else if (headerLevel > currentHeaderLevel) {
        //             const ol = document.createElement('ol');
        //             lastListItem!.appendChild(ol);
        //             currentList = ol;
        //             currentList.appendChild(listItem);
        //             currentHeaderLevel = headerLevel;
        //         } else {
        //             let diff = currentHeaderLevel - headerLevel;
        //             while (diff > 0) {
        //                 currentList = currentList.parentElement!.parentElement as HTMLElement;
        //                 diff--;
        //             }
        //             currentList.appendChild(listItem);
        //         }

        //         lastListItem = listItem;
        //         header.id = uniqueId;
        //     });
        // }

        function createTableOfContents() {
            const content = wikiElements.content!;
            const toc = wikiElements.tableOfContents!;
            const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const existingIds = new Set<string>();

            let currentList: HTMLElement = toc;
            let currentHeaderLevel: number = 1;
            let lastListItem: HTMLElement | null = null;

            headers.forEach((header, index) => {
                const id = toValidId(header.textContent!);
                const uniqueId = getUniqueId(id, existingIds);
                existingIds.add(uniqueId);

                const link = document.createElement('a');
                link.href = `#${uniqueId}`;
                link.textContent = header.textContent!;

                const listItem = document.createElement('li');
                listItem.appendChild(link);

                const headerLevel = parseInt(header.tagName.substring(1));

                if (headerLevel === currentHeaderLevel) {
                    currentList.appendChild(listItem);
                } else if (headerLevel > currentHeaderLevel) {
                    const ol = document.createElement('ol');
                    lastListItem!.appendChild(ol);
                    currentList = ol;
                    currentList.appendChild(listItem);
                    currentHeaderLevel = headerLevel;
                } else {
                    let diff = currentHeaderLevel - headerLevel;
                    while (diff > 0) {
                        currentList = currentList.parentElement!.parentElement as HTMLElement;
                        diff--;
                    }
                    currentList.appendChild(listItem);
                }

                if (index < headers.length - 1 && parseInt(headers[index + 1].tagName.substring(1)) > headerLevel) {
                    // Remove the last child (original <li> element) before appending <details>
                    currentList.removeChild(currentList.lastElementChild!);

                    const details = document.createElement('details');
                    const summary = document.createElement('summary');
                    summary.textContent = header.textContent!;
                    details.appendChild(summary);

                    // Create a new <ol> element for children
                    const childrenList = document.createElement('ol');
                    childrenList.style.marginLeft = `${(parseInt(childrenList.style.marginLeft) || 0) + .5}rem`;
                    details.appendChild(childrenList);

                    currentList.appendChild(details);
                    currentList = childrenList; // Set currentList to the children <ol>
                    currentHeaderLevel++;
                }

                lastListItem = listItem;
                header.id = uniqueId;
            });
        }

        createTableOfContents();

        // TODO: End of Optimize

        // must be last - QAEZZ
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/js/wiki/tooltips.js';
        document.body.appendChild(script);
    }

    private async displayUserPage(
        pageData: PageData,
        template: string
    ): Promise<void> {
        alert("displayUserPage");
    }
}

export { WikiController };
