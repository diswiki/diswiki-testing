export type ServerInformation = {
    version: number;
    last_updated: number;
    name: string;
    description?: string;
    server: string;
    likes?: number;
    shares?: number;
    reports?: number;
    invite: string;
    creation: {
        wiki: number;
        server: number;
    };
    auth: {
        server_owner: string;
        wiki_owner: string;
        wiki_admins: string[] | null;
    };
};

export type UserInformation = {
    version: number;
    last_updated: number;
    username: string;
    name: string;
    description?: string;
    likes?: number;
    shares?: number;
    reports?: number;
    uid: string;
    server: string;
    creation: {
        wiki: number;
        discord: number;
    };
};


export type WikiSidebarItem = {
    header: string;
    markdown_content: string;
    images_above_markdown_content: boolean;
    images: {
        name: string;
        caption: string;
    }[];
};

export type WikiSidebar = {
    content: WikiSidebarItem[];
};

export type wikiPageData = {
    tocHtmlString: string,
    wikiPageTitle: string,
    lastEditedTimeString: string,
    readTime: string,
    likeCount: string,
    shareCount: string,
    content: string,
    serverIconUrl: string,
    memberCount: string,
    membersOnline: string,
    serverCreation: string,
    serverAge: string,
    serverID: string,
    serverOwner: string,
    wikiOwner: string,
    wikiAdminsHtmlString: string,
    wikiCreation: string,
    joinLink: string,
    tooltipLastEditedTimeString: string,
    tooltipServerID: string,
    tooltipServerAge: string,
    tooltipServerOwner: string,
    tooltipWikiOwner: string

};

export type discordApiServerInfo = {
    icon: string,
    members: number,
    online: number
}
