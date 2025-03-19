import { ItemView, WorkspaceLeaf } from 'obsidian'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { BookModal } from '../modal/book-modal'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { Statistics } from '../../component/statistics/statistics'

export const VIEW_TYPE_STATISTICS = 'statistics'

export class StatisticsView extends ItemView {
    private root: Root | null = null

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
        this.root = createRoot(this.containerEl.children[1])

        this.update()
    }

    public update(): void {
        this.root!.render(
            <StrictMode>
                <Statistics bookshelf={this.bookshelf} onBookClick={(book) => new BookModal(this.app, book).open()} />
            </StrictMode>,
        )
    }
}
