class CWikiImage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const placement = this.getAttribute('placement') || 'left';
        let size = this.getAttribute('size') || 150;
        const file = this.getAttribute('file') || '';
        const caption = this.textContent || '';

        this.textContent = '';

        if (!['left', 'right', 'break'].includes(placement)) {
            throw new Error('Invalid placement. Only "left", "right", and "break" are allowed.');
        }

        size = parseInt(size);

        if (isNaN(size) || !isFinite(size)) {
            size = 150;
        }

        const pathnameParts = window.location.pathname.toLowerCase().split('/').slice(1);


        const imageUrl = `https://raw.githubusercontent.com/diswiki/database/main/${pathnameParts[0]}s/${pathnameParts[1]}/assets/${file}`;
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = caption;
        img.width = size;
        img.style.borderRadius = '5px';

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.padding = '5px';

        const p = document.createElement('p');
        p.textContent = caption;
        p.style.textAlign = 'center';
        p.style.fontSize = '.8rem';

        div.appendChild(img);
        div.appendChild(p);
        this.appendChild(div);

        if (placement === 'break') {
            div.style.alignItems = 'center';
        } else if (placement === 'right') {
            div.style.width = 'min-content';
            this.style.display = 'inline-block';
            this.style.width = 'min-content';
            this.style.float = 'right';
        } else {
            div.style.width = 'min-content';
            this.style.display = 'inline-block';
            this.style.width = 'min-content';
            this.style.float = 'left';
        }
    }
}

customElements.define('wiki-image', CWikiImage);