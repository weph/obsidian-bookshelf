import { ItemView, WorkspaceLeaf } from 'obsidian'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Statistics } from '../../component/statistics/statistics'
import BookshelfPlugin from '../bookshelf-plugin'

export const VIEW_TYPE_STATISTICS = 'statistics'

export class StatisticsView extends ItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private bookshelfPlugin: BookshelfPlugin,
        private bookshelf: Bookshelf,
    ) {
        super(leaf)
    }

    public getViewType(): string {
        return VIEW_TYPE_STATISTICS
    }

    public getDisplayText(): string {
        return 'Bookshelf statistics'
    }

    protected async onOpen(): Promise<void> {
        createRoot(this.containerEl.children[1]).render(
            <StrictMode>
                <Statistics
                    bookshelf={this.bookshelf}
                    onBookClick={(book) => this.bookshelfPlugin.openBookModal(book)}
                />
            </StrictMode>,
        )
    }
}
