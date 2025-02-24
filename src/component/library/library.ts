import { Book } from '../../bookshelf/book'
import '../gallery/gallery'
import '../table/table'
import '../input/input'
import '../dropdown/dropdown'
import { Input } from '../input/input'
import { Dropdown } from '../dropdown/dropdown'
import { BookSortOptions } from '../../bookshelf/sort/book-sort-options'

export interface LibraryProps {
    books: Array<Book>
    onBookClick: ((book: Book) => void) | null
    sortOptions: BookSortOptions
}

type ViewType = 'gallery' | 'table'

export class Library extends HTMLElement implements LibraryProps {
    private root: ShadowRoot

    private searchInput: Input

    private sortOptionsDropdown: Dropdown<string>

    private _view: ViewType

    private galleryContainer: HTMLElement

    private _books: Array<Book> = []

    public _onBookClick: ((book: Book) => void) | null = null

    private _sortOptions: BookSortOptions = new BookSortOptions()

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <header>
                <div id="header-left">
                    <bookshelf-ui-input></bookshelf-ui-input>
                    <bookshelf-ui-dropdown id="sort-options"></bookshelf-ui-dropdown>
                </div>
                <div id="header-right">
                    <bookshelf-ui-dropdown id="view"></bookshelf-ui-dropdown>
                </div>
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
            </style>
        `

        this.searchInput = this.root.querySelector('bookshelf-ui-input') as Input
        // Stryker disable next-line all
        this.searchInput.type = 'search'
        this.searchInput.placeholder = 'Search...'
        this.searchInput.onUpdate = () => this.update()

        this.sortOptionsDropdown = this.root.querySelector('#sort-options')!
        this.sortOptionsDropdown.onChange = () => this.update()
        this.sortOptionsDropdown.label = 'Sort'

        const viewDropdown: Dropdown<ViewType> = this.root.querySelector('#view')!
        viewDropdown.label = 'View'
        viewDropdown.options = [
            { value: 'gallery', label: 'Gallery' },
            { value: 'table', label: 'Table' },
        ]
        viewDropdown.onChange = (value) => (this.view = value)

        this.galleryContainer = this.root.querySelector('main') as HTMLElement

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
        const books = this.books
            .filter((b) => b.metadata.title.toLowerCase().includes(search.toLowerCase()))
            .sort(this.sortFunction())

        if (search && books.length === 0) {
            return this.emptyState('No books found', 'Try a different search term or check your spelling.')
        }

        if (this._view === 'table') {
            return this.bookList(books)
        }

        return this.bookGallery(books)
    }

    private sortFunction(): (a: Book, b: Book) => number {
        if (!this.sortOptionsDropdown.value) {
            return () => 0
        }

        return this._sortOptions.compareFunction(this.sortOptionsDropdown.value)
    }

    private bookGallery(books: Array<Book>): HTMLElement {
        const gallery = document.createElement('bookshelf-gallery')
        gallery.books = books
        gallery.onBookClick = this._onBookClick

        return gallery
    }

    private bookList(books: Array<Book>): HTMLElement {
        const gallery = document.createElement('bookshelf-table')
        gallery.books = books
        gallery.onBookClick = this._onBookClick

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

    set onBookClick(callback: ((book: Book) => void) | null) {
        this._onBookClick = callback
        this.update()
    }

    set sortOptions(value: BookSortOptions) {
        this._sortOptions = value
        this.sortOptionsDropdown.options = this._sortOptions.titles().map((title) => ({ value: title, label: title }))
        this.update()
    }

    set view(value: ViewType) {
        this._view = value
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
