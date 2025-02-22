import { ItemView, WorkspaceLeaf } from 'obsidian'
import '../../component/statistics/statistics'
import { Bookshelf } from '../../bookshelf'
import { Statistics } from '../../component/statistics/statistics'
import { Book } from '../../book'
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
        return 'Statistics'
    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]

        this.component = this.containerEl.createEl('bookshelf-statistics')
        this.component.onBookClick = (book: Book) => new BookModal(this.app, book).open()

        container.replaceChildren(this.component)

        this.update()
    }

    public update(): void {
        this.component.bookshelf = this.bookshelf
    }
}
