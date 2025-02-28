import { Book } from '../../bookshelf/book'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../star-rating/star-rating'

const TAG_NAME = 'bookshelf-table'

@customElement(TAG_NAME)
export class Table extends LitElement {
    static styles = css`
        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            vertical-align: top;
            padding: 0.25rem 0.5rem;
            text-align: left;
        }

        td {
            border-top: 1px solid var(--divider-color);
        }
    `

    @property({ attribute: false })
    public books: Array<Book> = []

    @property()
    public onBookClick: ((book: Book) => void) | null = null

    protected render() {
        return html`
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published</th>
                        <th>Rating</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.books.map(
                        (book) => html`
                            <tr>
                                <td>${book.metadata.title}</td>
                                <td>${book.metadata.authors?.join('<br />') || ''}</td>
                                <td>${book.metadata.published?.getFullYear() || ''}</td>
                                <td>
                                    <bookshelf-ui-star-rating
                                        value="${book.metadata.rating || 0}"
                                    ></bookshelf-ui-star-rating>
                                </td>
                                <td>${book.metadata.tags?.join(', ') || ''}</td>
                            </tr>
                        `,
                    )}
                </tbody>
            </table>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Table
    }
}
