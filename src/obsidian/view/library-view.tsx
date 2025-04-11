import { ItemView, WorkspaceLeaf } from 'obsidian'
import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { bookSortOptions } from '../../component/library/book-sort-options'
import { Library } from '../../component/library/library'
import BookshelfPlugin from '../bookshelf-plugin'
import { useSyncedData } from '../../component/hooks/use-synced-data'
import { Book } from '../../bookshelf/book/book'

export const VIEW_TYPE_LIBRARY = 'library'

export class LibraryView extends ItemView {
    private root: Root | null = null

    constructor(
        leaf: WorkspaceLeaf,
        private bookshelfPlugin: BookshelfPlugin,
        private bookshelf: Bookshelf,
    ) {
        super(leaf)
    }

    getViewType(): string {
        return VIEW_TYPE_LIBRARY
    }

    getDisplayText(): string {
        return 'Bookshelf library'
    }

    protected async onOpen(): Promise<void> {
        this.root = createRoot(this.containerEl.children[1])

        this.update(this.bookshelf)
    }

    public update(bookshelf: Bookshelf): void {
        this.bookshelf = bookshelf

        this.root!.render(
            <StrictMode>
                <SyncedLibrary
                    bookshelf={this.bookshelf}
                    onBookClick={(book) => this.bookshelfPlugin.openBookModal(book)}
                />
            </StrictMode>,
        )
    }
}

function SyncedLibrary({ bookshelf, onBookClick }: { bookshelf: Bookshelf; onBookClick: (book: Book) => void }) {
    const books = useSyncedData(bookshelf, (b) => Array.from(b.all()))

    return <Library books={books} sortOptions={bookSortOptions} onBookClick={onBookClick} />
}
