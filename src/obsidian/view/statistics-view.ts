import { ItemView, WorkspaceLeaf } from 'obsidian'
import '../../component/statistics/statistics'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { Statistics } from '../../component/statistics/statistics'
import { Book } from '../../bookshelf/book'
import { BookModal } from '../modal/book-modal'

export const VIEW_TYPE_STATISTICS = 'statistics'

export class StatisticsView extends ItemView {
    private component: Statistics

    constructor(
        leaf: WorkspaceLeaf,
        private bookshelf: Bookshelf,
    ) {
        super(leaf)
    }

    getViewType(): string {
        return VIEW_TYPE_STATISTICS
    }

    getDisplayText(): string {
        return 'Bookshelf statistics'
    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]

        this.component = this.containerEl.createEl('bookshelf-statistics')
        this.component.bookshelf = this.bookshelf
        this.component.onBookClick = (book: Book) => new BookModal(this.app, book).open()

        container.replaceChildren(this.component)
    }

    public update(): void {
        this.component.requestUpdate()
    }
}
