import { RouteControllerTemplate } from "../wikiRouting";
import { showError } from "../helpers/errors";

class RootController implements RouteControllerTemplate {
    async start(pathnameParts: string[]): Promise<void> {
        return;
    }
}

export {
    RootController
}