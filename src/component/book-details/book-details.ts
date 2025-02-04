import { Book } from '../../book'

export interface BookDetailsProps {
    book: Book
}

export class BookDetails extends HTMLElement implements BookDetailsProps {
    private root: ShadowRoot

    private _book: Book

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    private update(): void {
        const cover = this.book.cover
        const title = this.book.title
        const authors = this.book.authors
        const published = this.book.published

        this.root.innerHTML = `
            <main>
                <div id="cover">
                    ${cover ? `<img src="${cover}" alt="${title}" />` : ''}
                </div>
                <ul id="details">
                    ${authors?.length ? `<li><strong>Author:</strong> ${authors.join(', ')}</li>` : ''}
                    ${published ? `<li><strong>Published:</strong> ${published.getFullYear()}</li>` : ''}
                </ul>
            </main>
            <style>
                main {
                    display: flex;
                    flex-direction: row;
                    gap: 15px;
                }
                
                #cover {
                    width: 25%;
                    aspect-ratio: 1/1.25;
                }
                
                #cover img {
                    width: 100%;
                }
                
                #details {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                #details li {
                    padding: 2px;
                }
            </style>
        `
    }

    get book() {
        return this._book
    }

    set book(book: Book) {
        this._book = book
        this.update()
    }
}

const TAG_NAME = 'bookshelf-book-details'

customElements.define(TAG_NAME, BookDetails)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: BookDetails
    }
}
