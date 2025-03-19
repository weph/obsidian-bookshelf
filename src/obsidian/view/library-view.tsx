import { ItemView, WorkspaceLeaf } from 'obsidian'
import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { BookModal } from '../modal/book-modal'
import { defaultBookSortOptions } from '../../bookshelf/sort/default-book-sort-options'
import { Library } from '../../component/library/library'

export const VIEW_TYPE_LIBRARY = 'library'

export class LibraryView extends ItemView {
    private root: Root | null = null

    constructor(
        leaf: WorkspaceLeaf,
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

        this.update()
    }

    public update(): void {
        this.root!.render(
            <StrictMode>
                <Library
                    books={Array.from(this.bookshelf.all())}
                    sortOptions={defaultBookSortOptions()}
                    onBookClick={(book) => new BookModal(this.app, book).open()}
                />
            </StrictMode>,
        )
    }
}
