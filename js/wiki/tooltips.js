
var tooltipMapping = [
    {
        "id": "#wiki-action-like",
        "content": "Like Page"
    },
    {
        "id": "#wiki-action-share",
        "content": "Share Page"
    },
    {
        "id": "#wiki-action-report",
        "content": "Report Page"
    },
    {
        "id": "#wiki-last-edited",
        "dataTooltip": true
    },
    {
        "id": "#wiki-sidebar-server-id",
        "dataTooltip": true
    },
    {
        "id": "#wiki-sidebar-server-age",
        "dataTooltip": true
    },
    {
        "id": "#wiki-sidebar-server-owner",
        "dataTooltip": true
    },
    {
        "id": "#wiki-sidebar-wiki-owner",
        "dataTooltip": true
    }

];

console.log(`Setting up ${tooltipMapping.length} tooltip(s).`);

for (var i = 0; i < tooltipMapping.length; i++) {
    currentToolip = tooltipMapping[i];
    if (currentToolip.dataTooltip) {
        tippy(currentToolip.id, {
            content: document.querySelector(currentToolip.id).getAttribute('data-tooltip'),
            interactive: true,
        });
        continue;
    }
    tippy(currentToolip.id, {
        content: currentToolip.content
    });
}

console.log(`Finished setting up ${tooltipMapping.length} tooltip(s).`);
