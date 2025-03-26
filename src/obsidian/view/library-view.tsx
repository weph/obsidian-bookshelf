import { ItemView, WorkspaceLeaf } from 'obsidian'
import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { defaultBookSortOptions } from '../../bookshelf/sort/default-book-sort-options'
import { Library } from '../../component/library/library'
import BookshelfPlugin from '../bookshelf-plugin'

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
                <Library
                    books={Array.from(this.bookshelf.all())}
                    sortOptions={defaultBookSortOptions()}
                    onBookClick={(book) => this.bookshelfPlugin.openBookModal(book)}
                />
            </StrictMode>,
        )
    }
}
