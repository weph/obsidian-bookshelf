import { Book } from '../../bookshelf/book'
import '../gallery/gallery'
import '../table/table'
import '../input/input'
import '../dropdown/dropdown'
import { BookSortOptions } from '../../bookshelf/sort/book-sort-options'
import { css, html, LitElement, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-library'

type ViewType = 'gallery' | 'table'

@customElement(TAG_NAME)
export class Library extends LitElement {
    static styles = css`
        header {
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--bookshelf--library--header-background);
            z-index: 9999;
            box-sizing: border-box;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: var(--size-4-3);
            padding: var(--bookshelf--library--header-padding);
        }

        #header-left {
            display: flex;
            flex-direction: row;
            gap: var(--size-4-3);
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
    `

    @state()
    private searchTerm: string = ''

    @state()
    private sortOption: string | null = null

    @property()
    public view: ViewType

    @property()
    public books: Array<Book> = []

    @property()
    public onBookClick: ((book: Book) => void) | null = null

    @property()
    public sortOptions: BookSortOptions = new BookSortOptions()

    protected render() {
        return html`
            <header>
                <div id="header-left">
                    <bookshelf-ui-input
                        .type=${'search'}
                        .placeholder=${'Search...'}
                        .value="${this.searchTerm}"
                        .onUpdate=${(term: string) => (this.searchTerm = term)}
                    ></bookshelf-ui-input>
                    <bookshelf-ui-dropdown
                        label="Sort"
                        .value=${this.sortOption}
                        .onChange=${(value: string) => (this.sortOption = value)}
                        .options=${this.sortOptions.titles().map((title) => ({ value: title, label: title }))}
                    ></bookshelf-ui-dropdown>
                </div>
                <div id="header-right">
                    <bookshelf-ui-dropdown
                        label="View"
                        value=${this.view}
                        .options=${[
                            { value: 'gallery', label: 'Gallery' },
                            { value: 'table', label: 'Table' },
                        ]}
                        .onChange=${(view: ViewType) => (this.view = view)}
                    ></bookshelf-ui-dropdown>
                </div>
            </header>
            <main>${this.content()}</main>
        `
    }

    private content(): TemplateResult {
        if (this.books.length === 0) {
            return this.emptyState(
                'No books found',
                'Set up Bookshelf or add your first book note to start building your library.',
            )
        }

        const search = this.searchTerm
        const books = this.books
            .filter((b) => b.metadata.title.toLowerCase().includes(search.toLowerCase()))
            .sort(this.sortFunction())

        if (search && books.length === 0) {
            return this.emptyState('No books found', 'Try a different search term or check your spelling.')
        }

        if (this.view === 'table') {
            return html` <bookshelf-table .books=${books} .onBookClick=${this.onBookClick}></bookshelf-table> `
        }

        return html` <bookshelf-gallery .books=${books} .onBookClick=${this.onBookClick}></bookshelf-gallery> `
    }

    private sortFunction(): (a: Book, b: Book) => number {
        if (this.sortOption !== null) {
            return this.sortOptions.compareFunction(this.sortOption)
        }

        if (this.sortOptions.titles().length > 0) {
            return this.sortOptions.compareFunction(this.sortOptions.titles()[0])
        }

        return () => 0
    }

    private emptyState(headline: string, message: string): TemplateResult {
        return html`
            <div>
                <div id="message-container">
                    <h1>${headline}</h1>
                    <p>${message}</p>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Library
    }
}
