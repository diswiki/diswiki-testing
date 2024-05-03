async function showError(status: number): Promise<void> {
    document.body.innerHTML = "";
    let httpCat = document.createElement('img');
    httpCat.classList.add('fixed', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
    httpCat.src = `https://http.cat/${status}.jpg`;
    document.body.appendChild(httpCat);
}

async function showFixedHeader(message: string): Promise<void> {
    let header = document.createElement('div');
    header.classList.add('fixed', 'w-screen', 'h-auto', 'py-5', 'text-xl', 'bg-red-500', 'inset-x-0', 'top-0');

    let headerMessage = document.createElement('p');
    headerMessage.classList.add('text-white', 'text-center');
    headerMessage.textContent = message;

    let headerClose = document.createElement('i');
    headerClose.classList.add('bx', 'bx-x', 'bx-fw', 'bx-md', 'absolute', 'text-white', 'inset-y-0', 'right-0', 'top-1/2', 'transform', '-translate-y-1/3', 'hover:cursor-pointer', 'hover:opacity-80');

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