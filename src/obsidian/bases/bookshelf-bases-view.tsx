import { BasesEntry, BasesView, QueryController } from 'obsidian'
import { Bookshelf } from '../../bookshelf/bookshelf'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { GroupedData } from '../../bookshelf/book/grouping'
import { ObsidianNotes } from '../obsidian-notes'
import { ComponentType, MouseEvent, StrictMode } from 'react'
import { GroupedView } from '../../component/library/grouped-books/grouped-view'
import styles from './bookshelf-bases-view.module.scss'
import { BookViewItem } from '../../component/library/book-view-item'
import { Book } from '../../bookshelf/book/book'

export abstract class BookshelfBasesView extends BasesView {
    private root: Root

    abstract readonly viewComponent: ComponentType<{
        items: Array<BookViewItem>
        onBookClick: (book: Book, event: MouseEvent) => void
    }>

    constructor(
        controller: QueryController,
        parentEl: HTMLElement,
        private readonly notes: ObsidianNotes,
        private readonly bookshelf: Bookshelf,
        private bookshelfPlugin: BookshelfPlugin,
    ) {
        super(controller)

        this.root = createRoot(parentEl)
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
                group.entries.map((entry) => this.bookViewItemFromBaseEntry(entry)),
            )
        }

        this.root.render(
            <StrictMode>
                <div className={styles.container}>
                    <GroupedView
                        items={result}
                        onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                        ViewComponent={this.viewComponent}
                    />
                </div>
            </StrictMode>,
        )
    }

    private bookViewItemFromBaseEntry(entry: BasesEntry): BookViewItem {
        return {
            book: this.bookshelf.book(this.notes.noteByFile(entry.file)),
            fields: this.data.properties.map((p) => {
                return {
                    name: this.config.getDisplayName(p),
                    renderTo: (e: HTMLElement) => entry.getValue(p)!.renderTo(e, this.app.renderContext),
                }
            }),
        }
    }
}
