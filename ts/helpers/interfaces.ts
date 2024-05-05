interface RouteControllerTemplate {
    start(pathnameParts: string[]): Promise<void>;
}

interface WikiElements {
    [key: string]: HTMLElement | null;
}

interface ServerInfo {
    icon: string;
    members: number;
    online: number;
}

export {
    WikiElements,
    RouteControllerTemplate,
    ServerInfo
}