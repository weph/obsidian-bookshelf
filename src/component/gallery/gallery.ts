import { Book } from '../../bookshelf/book'
import './gallery-card'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-gallery'

@customElement(TAG_NAME)
export class Gallery extends LitElement {
    static styles = css`
        :host {
            display: grid;
            grid-template-columns: repeat(auto-fit, 150px);
            grid-gap: 15px;
            justify-content: center;
        }
    `

    @property()
    public books: Array<Book>

    @property()
    public onBookClick: ((book: Book) => void) | null = null

    protected render() {
        return html` ${this.books.map(
            (book, index) =>
                html` <div role="list">
                    <bookshelf-gallery-card
                        index="${index}"
                        title="${book.metadata.title}"
                        cover="${book.metadata.cover}"
                        role="listitem"
                        @click="${() => this.onBookClick && this.onBookClick(book)}"
                    >
                    </bookshelf-gallery-card>
                </div>`,
        )}`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Gallery
    }
}
