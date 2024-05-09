// function createTableOfContents() {
//     const content = wikiElements.content!;
//     const toc = wikiElements.tableOfContents!;
//     const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
//     const existingIds = new Set<string>();

//     let currentList: HTMLElement = toc;
//     let currentHeaderLevel: number = 1;
//     let lastListItem: HTMLElement | null = null;

//     headers.forEach((header, index) => {
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

//         if (index < headers.length - 1 && parseInt(headers[index + 1].tagName.substring(1)) > headerLevel) {
//             // Remove the last child (original <li> element) before appending <details>
//             currentList.removeChild(currentList.lastElementChild!);

//             const details = document.createElement('details');
//             const summary = document.createElement('summary');
//             summary.textContent = header.textContent!;
//             details.appendChild(summary);

//             // Create a new <ol> element for children
//             const childrenList = document.createElement('ol');
//             childrenList.style.marginLeft = `${(parseInt(childrenList.style.marginLeft) || 0) + .5}rem`;
//             details.appendChild(childrenList);

//             currentList.appendChild(details);
//             currentList = childrenList; // Set currentList to the children <ol>
//             currentHeaderLevel++;
//         }

//         lastListItem = listItem;
//         header.id = uniqueId;
//     });
// }

// export {
//     createTableOfContents
// }

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


//@ts-expect-error
function createTableOfContents(content) {
    const headers = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
    if (!headers) return ''; // No headers found, return empty string

    const existingIds = new Set();
    let currentList = '<ul>';
    let currentHeaderLevel = 1;

    //@ts-expect-error
    headers.forEach((header, index) => {
        const id = toValidId(header.replace(/<[^>]*>/g, ''));
        const uniqueId = getUniqueId(id, existingIds);
        existingIds.add(uniqueId);

        const link = `<a href="#${uniqueId}">${header.replace(/<[^>]*>/g, '')}</a>`;
        const listItem = `<li>${link}</li>`;

        const headerLevel = parseInt(header.charAt(2));

        if (headerLevel === currentHeaderLevel) {
            currentList += listItem;
        } else if (headerLevel > currentHeaderLevel) {
            currentList += '<ol>';
            currentList += listItem;
            currentHeaderLevel = headerLevel;
        } else {
            let diff = currentHeaderLevel - headerLevel;
            while (diff > 0) {
                currentList += '</ol>';
                diff--;
            }
            currentList += listItem;
        }

        if (index < headers.length - 1 && parseInt(headers[index + 1].charAt(2)) > headerLevel) {
            // TODO: Fix removing the last li tag.
            currentList = currentList.slice(0, -5); // Remove the last </li> before appending <details>
            currentList += `<details><summary>${header.replace(/<[^>]*>/g, '')}</summary><ol>`;
            currentHeaderLevel++;
        }
    });

    while (currentHeaderLevel > 1) {
        currentList += '</ol>';
        currentHeaderLevel--;
    }

    currentList += '</ul>';

    return currentList;
}

export {
    createTableOfContents
}
