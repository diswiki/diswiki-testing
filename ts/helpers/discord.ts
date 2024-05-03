async function fetchServerIconUrl(invite: string): Promise<string> {
    try {
        const response = await fetch(`https://discord.com/api/invites/${invite}`);
        const inviteData = await response.json();
        const servericon = inviteData.guild.icon;
        const serverid = inviteData.guild.id;
        const ext = servericon.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/icons/${serverid}/${servericon}.${ext}`;
    } catch (error) {
        console.error('Error fetching invite:', error);
        return 'not found';
    }
}

export {
    fetchServerIconUrl
}