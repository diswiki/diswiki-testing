async function showError(status: number): Promise<void> {
    document.body.innerHTML = "";
    let httpCat = document.createElement('img');
    httpCat.classList.add('fullscreen-http');
    // httpCat.setAttribute('style', 'position: absolute; left: 50%; transform: translate(-50%, 50%);');
    httpCat.src = `https://http.cat/${status}.jpg`;
    document.body.appendChild(httpCat);
}

async function showFixedHeader(message: string): Promise<void> {
    let header = document.createElement('div');
    header.classList.add('fixed-header');

    let headerMessage = document.createElement('p');
    headerMessage.classList.add('text-white', 'text-center');
    headerMessage.textContent = message;

    let headerClose = document.createElement('i');
    headerClose.classList.add('bx', 'bx-x', 'bx-fw', 'bx-md', 'fixed-header-close');

    headerClose.addEventListener('click', () => {
        header.remove();
    });

    header.appendChild(headerMessage);
    header.appendChild(headerClose);

    document.body.appendChild(header);
}

export {
    showError,
    showFixedHeader
}