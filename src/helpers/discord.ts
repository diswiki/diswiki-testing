import type { discordApiServerInfo } from "./types";

async function fetchServerDetails(invite: string): Promise<[discordApiServerInfo, string]> {
    let serverInfo: discordApiServerInfo = {
        "icon": "https://raw.githubusercontent.com/diswiki/resources/main/assets/loading.gif?raw=true",
        "members": 0,
        "online": 0
    };
    const response = await fetch(`https://discord.com/api/v9/invites/${invite}?with_counts=true`);
    if (!response.ok) {
        return [serverInfo, "Couldn't fetch member count, online count, nor server icon from Discord."];
    }

    const responseData = await response.json();
    const servericon = responseData.guild.icon;
    const serverid = responseData.guild.id;
    const ext = servericon.startsWith('a_') ? 'gif' : 'png';
    serverInfo.icon = `https://cdn.discordapp.com/icons/${serverid}/${servericon}.${ext}`;
    serverInfo.members = responseData.approximate_member_count;
    serverInfo.online = responseData.approximate_presence_count;

    return [serverInfo, 'none'];
}

export {
    fetchServerDetails
}