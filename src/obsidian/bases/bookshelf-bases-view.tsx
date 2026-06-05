import { BasesAllOptions, BasesEntry, BasesPropertyId, BasesView, QueryController } from 'obsidian'
import { Bookshelf } from '../../bookshelf/bookshelf'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { GroupedData } from '../../bookshelf/book/grouping'
import { ObsidianNotes } from '../obsidian-notes'
import { ComponentType, MouseEvent, StrictMode } from 'react'
import styles from './bookshelf-bases-view.module.scss'
import { BookViewField, BookViewItem } from '../../component/library/book-view-item'
import { Book } from '../../bookshelf/book/book'

export abstract class BookshelfBasesView extends BasesView {
    private root: Root

    abstract readonly viewComponent: ComponentType<{
        items: GroupedData<Array<BookViewItem>> | Array<BookViewItem>
        onBookClick: (book: Book, event: MouseEvent) => void
    }>

    constructor(
        controller: QueryController,
        parentEl: HTMLElement,
        protected readonly notes: ObsidianNotes,
        protected readonly bookshelf: Bookshelf,
        protected bookshelfPlugin: BookshelfPlugin,
    ) {
        super(controller)

        this.root = createRoot(parentEl.createDiv())
    }

    static options(): Array<BasesAllOptions> {
        return []
    }

    public onDataUpdated(): void {
        const result: GroupedData<Array<BookViewItem>> = {
            groups: new Map<string | null, Array<BookViewItem>>(),
            nullLabel: 'Ungrouped',
        }

        for (const group of this.data.groupedData) {
            const key = group.hasKey() ? (group.key?.toString() ?? '') : null

            result.groups.set(
                key,
                group.entries.map((entry) => this.bookViewItemFromBasesEntry(entry)),
            )
        }

        this.root.render(
            <StrictMode>
                <div className={styles.container}>
                    <this.viewComponent
                        items={result}
                        onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                    />
                </div>
            </StrictMode>,
        )
    }

    protected abstract bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem

    protected bookViewFieldFromBasesPropertyId(entry: BasesEntry, id: BasesPropertyId): BookViewField {
        return {
            name: this.config.getDisplayName(id),
            renderTo: (e: HTMLElement) => entry.getValue(id)!.renderTo(e, this.app.renderContext),
        }
    }
}
