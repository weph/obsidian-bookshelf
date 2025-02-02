import { ItemView, WorkspaceLeaf } from 'obsidian'
import '../../component/library/library'
import { Bookshelf } from '../../bookshelf'
import { Library } from '../../component/library/library'

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

        container.replaceChildren(this.libraryComponent)

        this.update()
    }

    public update(): void {
        this.libraryComponent.books = Array.from(this.bookshelf.all())
    }
}
