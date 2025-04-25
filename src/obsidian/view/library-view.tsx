import { ItemView, WorkspaceLeaf } from 'obsidian'
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { bookSortOptions } from '../../component/library/book-sort-options'
import { Library, Settings } from '../../component/library/library'
import BookshelfPlugin from '../bookshelf-plugin'
import { useSyncedData } from '../../component/hooks/use-synced-data'
import { Book } from '../../bookshelf/book/book'

export const VIEW_TYPE_LIBRARY = 'library'

export class LibraryView extends ItemView {
    public icon = 'library-big'

    constructor(
        leaf: WorkspaceLeaf,
        private bookshelfPlugin: BookshelfPlugin,
        private bookshelf: Bookshelf,
    ) {
        super(leaf)
    }

    public getViewType(): string {
        return VIEW_TYPE_LIBRARY
    }

    public getDisplayText(): string {
        return 'Bookshelf library'
    }

    protected async onOpen(): Promise<void> {
        createRoot(this.containerEl.children[1]).render(
            <StrictMode>
                <SyncedLibrary
                    bookshelf={this.bookshelf}
                    onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                />
            </StrictMode>,
        )
    }
}

function SyncedLibrary({ bookshelf, onBookClick }: { bookshelf: Bookshelf; onBookClick: (book: Book) => void }) {
    const [settings, setSettings] = useState<Settings>({
        search: '',
        list: null,
        status: null,
        grouping: null,
        sort: null,
        view: 'gallery',
    })
    const books = useSyncedData(bookshelf, (b) => Array.from(b.all()))

    return (
        <Library
            settings={settings}
            settingsChanged={setSettings}
            books={books}
            sortOptions={bookSortOptions}
            onBookClick={onBookClick}
        />
    )
}
