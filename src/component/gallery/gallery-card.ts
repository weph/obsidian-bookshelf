export interface GalleryCardProps {
    title: string
}

export class GalleryCard extends HTMLElement implements GalleryCardProps {
    private root: ShadowRoot

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.root.innerHTML = `
            <span id="title">${this.title}</span>
            ${css()}
		`
    }
}

function css(): string {
    return `
        <style>
            :host {
                display: block;
                position: relative;
                width: 100%;
                max-width: 200px;
                aspect-ratio: 1/1.25;
                background-color: var(--bookshelf--gallery-card--background-color);
                padding: 10px;
                box-shadow: var(--bookshelf--gallery-card--shadow);
                box-sizing: border-box;
            }
            
            #title {
                display: block;
                font-weight: bold;
                text-align: center;
                overflow-wrap: break-word;
            }
        </style>`
}

const TAG_NAME = 'bookshelf-gallery-card'

customElements.define(TAG_NAME, GalleryCard)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: GalleryCard
    }
}
