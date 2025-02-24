import { ItemView, WorkspaceLeaf } from 'obsidian'
import '../../component/library/library'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { Library } from '../../component/library/library'
import { Book } from '../../bookshelf/book'
import { BookModal } from '../modal/book-modal'
import { defaultBookSortOptions } from '../../bookshelf/sort/default-book-sort-options'

export const VIEW_TYPE_LIBRARY = 'library'

export class LibraryView extends ItemView {
    private libraryComponent: Library

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
        return 'Library'
    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]

        this.libraryComponent = this.containerEl.createEl('bookshelf-library')
        this.libraryComponent.onBookClick = (book: Book) => new BookModal(this.app, book).open()
        this.libraryComponent.sortOptions = defaultBookSortOptions()

        container.replaceChildren(this.libraryComponent)

        this.update()
    }

    public update(): void {
        this.libraryComponent.books = Array.from(this.bookshelf.all())
    }
}
