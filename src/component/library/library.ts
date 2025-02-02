import { Book } from '../../book'
import '../gallery/gallery'

export interface LibraryProps {
    books: Array<Book>
}

export class Library extends HTMLElement implements LibraryProps {
    private root: ShadowRoot

    private searchInput: HTMLInputElement

    private galleryContainer: HTMLElement

    private _books: Array<Book> = []

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <header>
                <input type="search" placeholder="Search..." />
            </header>
            <main>
            </main>
            <style>
                header {
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: var(--bookshelf--library--header-background);
                    z-index: 9999;
                    padding: var(--bookshelf--library--header-padding);
                    box-sizing: border-box;
                }
                
                main {
                    padding: 20px 10px;
                }
                
                #message-container {
                    text-align: center;
                    margin-top: 20px;
                }
                                
                #message-container p {
                    font-style: italic;
                    color: var(--bookshelf--text--color-dimmed);
                }
            </style>
        `

        this.searchInput = this.root.querySelector('input[type="search"]') as HTMLInputElement
        this.galleryContainer = this.root.querySelector('main') as HTMLElement

        this.searchInput.addEventListener('keyup', () => this.update())
        this.searchInput.addEventListener('search', () => this.update())

        this.update()
    }

    private update() {
        this.galleryContainer.replaceChildren(this.content())
    }

    private content(): HTMLElement {
        if (this.books.length === 0) {
            return this.emptyState(
                'No books found',
                'Set up Bookshelf or add your first book note to start building your library.',
            )
        }

        const search = this.searchInput.value
        const books = this.books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))

        if (search && books.length === 0) {
            return this.emptyState('No books found', 'Try a different search term or check your spelling.')
        }

        return this.bookGallery(books)
    }

    private bookGallery(books: Array<Book>): HTMLElement {
        const gallery = document.createElement('bookshelf-gallery')
        gallery.books = books

        return gallery
    }

    private emptyState(headline: string, message: string): HTMLElement {
        const element = document.createElement('div')
        element.innerHTML = `<div id="message-container"><h1>${headline}</h1><p>${message}</p></div>`

        return element
    }

    get books(): Array<Book> {
        return this._books
    }

    set books(value: Array<Book>) {
        this._books = value
        this.update()
    }
}

const TAG_NAME = 'bookshelf-library'

customElements.define(TAG_NAME, Library)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Library
    }
}
