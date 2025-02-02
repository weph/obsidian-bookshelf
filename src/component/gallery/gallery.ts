import { Book } from '../../book'
import './gallery-card'

export interface GalleryProps {
    books: Array<Book>
}

class Gallery extends HTMLElement implements GalleryProps {
    private root: ShadowRoot

    private _books: Array<Book> = []

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    private update() {
        const markup = this._books
            .map(
                (book) =>
                    `<div role="list"><bookshelf-gallery-card title="${book.title}" role="listitem"></bookshelf-gallery-card></div>`,
            )
            .join('')

        this.root.innerHTML = `${markup}${css()}`
    }

    set books(value: Array<Book>) {
        this._books = value
        this.update()
    }
}

function css(): string {
    return `
        <style>
            :host {
                display: grid;
                grid-template-columns: repeat(auto-fit, 150px);
                grid-gap: 15px;
                padding: 15px;
            }
        </style>`
}

const TAG_NAME = 'bookshelf-gallery'

customElements.define(TAG_NAME, Gallery)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Gallery
    }
}
