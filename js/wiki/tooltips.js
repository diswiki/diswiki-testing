const sleep = ms => new Promise(r => setTimeout(r, ms));

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

console.log('Setting up tooltip(s).');

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
        content: currentToolip.content,
        interactive: true,
    });
}

const iShouldRewriteThis = document.querySelectorAll('.js-has-tooltip');
for (let j = 0; j < iShouldRewriteThis.length; j++) {
    const element = iShouldRewriteThis[j];
    tippy(element, {
        content: element.getAttribute('data-tooltip'),
        interactive: true,
    });
}

console.log('Finished setting up tooltip(s).');
