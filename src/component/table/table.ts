import { Book } from '../../book'

export interface TableProps {
    books: Array<Book>
    onBookClick: ((book: Book) => void) | null
}

export class Table extends HTMLElement implements TableProps {
    private root: ShadowRoot

    private _books: Array<Book> = []

    private tableBody: HTMLTableSectionElement

    public onBookClick: ((book: Book) => void) | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
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
                </tbody>
            </table>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                td, th {
                    vertical-align: top;
                    padding: 0.25rem 0.5rem;
                    text-align: left;
                }
                
                td {
                    border-top: 1px solid var(--divider-color);
                }
                
                img {
                    width: 100%;
                }
            </style>
        `

        this.tableBody = this.root.querySelector('tbody')!
    }

    private update() {
        this.tableBody.innerHTML = this._books
            .map(
                (book) => `
            <tr>
                <td>${book.metadata.title}</td>
                <td>${book.metadata.authors?.join('<br />') || ''}</td>
                <td>${book.metadata.published?.getFullYear() || ''}</td>
                <td><bookshelf-ui-star-rating value="${book.metadata.rating}"></bookshelf-ui-star-rating></td>
                <td>${book.metadata.tags?.join(', ') || ''}</td>
            </tr>
        `,
            )
            .join('')
    }

    set books(value: Array<Book>) {
        this._books = value
        this.update()
    }
}

const TAG_NAME = 'bookshelf-table'

customElements.define(TAG_NAME, Table)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Table
    }
}
