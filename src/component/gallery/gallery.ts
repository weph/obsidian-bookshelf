import { Book } from '../../bookshelf/book'
import './gallery-card'
import { GalleryCard } from './gallery-card'

export interface GalleryProps {
    books: Array<Book>
    onBookClick: ((book: Book) => void) | null
}

export class Gallery extends HTMLElement implements GalleryProps {
    private root: ShadowRoot

    private _books: Array<Book> = []

    public onBookClick: ((book: Book) => void) | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.addEventListener('click', (e) => {
            if (this.onBookClick === null) {
                return
            }

            const index = (e.target as GalleryCard).getAttribute('index') || ''
            this.onBookClick(this._books[parseInt(index)])
        })
    }

    private update() {
        const markup = this._books
            .map(
                (book, index) => `<div role="list">
                    <bookshelf-gallery-card 
                        index="${index}"
                        title="${book.metadata.title}"
                        ${book.metadata.cover ? `cover="${book.metadata.cover}"` : ''}
                        role="listitem">
                    </bookshelf-gallery-card>
                </div>`,
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
                justify-content: center;
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
