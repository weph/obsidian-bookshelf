export interface GalleryCardProps {
    title: string
    cover?: string
}

export class GalleryCard extends HTMLElement implements GalleryCardProps {
    private root: ShadowRoot

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        const cover = this.getAttribute('cover')
        const title = this.getAttribute('title')

        this.root.innerHTML = `
            ${cover ? `<img src="${cover}" alt="${title}" />` : ''}
            <div id="${cover ? 'overlay' : 'fallback-cover'}">
				<span id="title">${title}</span>
			</div>
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
            
            img {
                display: block;
                width: 100%;				
            }
            
            #fallback-cover {
                height: 100%;
                display: flex;
                flex-flow: column;
                justify-content: center;
                font-weight: bold;
                text-align: center;
            }

            #title {
                display: block;
                font-weight: bold;
                text-align: center;
                overflow-wrap: break-word;
                cursor: default;
            }
            
            #overlay {
                display: none;
                flex-flow: column;
                justify-content: center;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                padding: 10px;
                background-color: rgb(from var(--bookshelf--gallery-card--background-color) r g b / 0.8);
                box-sizing: border-box;
            }
            
            :host(:hover) #overlay {
                display: flex;
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
