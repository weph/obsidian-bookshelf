import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-gallery-card'

@customElement(TAG_NAME)
export class GalleryCard extends LitElement {
    static styles = css`
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
    `

    @property()
    public cover: string

    @property()
    public title: string

    protected render() {
        return html`
            ${this.cover ? html`<img src="${this.cover}" alt="${this.title}" />` : ''}
            <div id="${this.cover ? 'overlay' : 'fallback-cover'}">
                <span id="title">${this.title}</span>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: GalleryCard
    }
}
