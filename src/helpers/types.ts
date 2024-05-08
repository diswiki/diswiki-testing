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