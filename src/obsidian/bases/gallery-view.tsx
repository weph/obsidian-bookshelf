import { BasesView, QueryController } from 'obsidian'
import { Bookshelf } from '../../bookshelf/bookshelf'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { GroupedData } from '../../bookshelf/book/grouping'
import { ObsidianNotes } from '../obsidian-notes'
import { StrictMode } from 'react'
import { GroupedView } from '../../component/library/grouped-books/grouped-view'
import { Gallery } from '../../component/library/gallery/gallery'
import styles from './gallery-view.module.scss'
import { BookViewItem } from '../../component/library/book-view-item'

export const GalleryViewType = 'bookshelf-gallery'

export class GalleryView extends BasesView {
    readonly type = GalleryViewType
    private root: Root

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
                group.entries.map((entry) => ({ book: this.bookshelf.book(this.notes.noteByFile(entry.file)) })),
            )
        }

        this.root.render(
            <StrictMode>
                <div className={styles.galleryView}>
                    <GroupedView
                        items={result}
                        onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                        ViewComponent={Gallery}
                    />
                </div>
            </StrictMode>,
        )
    }
}
