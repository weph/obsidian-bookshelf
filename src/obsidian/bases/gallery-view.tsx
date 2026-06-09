import { BookshelfBasesView } from './bookshelf-bases-view'
import { Gallery } from '../../component/library/view/gallery/gallery'
import { BasesAllOptions, BasesEntry } from 'obsidian'
import { BookViewItem } from '../../component/library/book-view-item'
import { StrictMode } from 'react'
import styles from './bookshelf-bases-view.module.scss'
import { GroupedData } from '../../bookshelf/book/grouping'
import { ProgressBarOptions } from '../../component/library/view/gallery/gallery-card'

const CONFIG_SHOW_READING_PROGRESS = 'show_reading_progress'

export const GalleryViewType = 'bookshelf-gallery'

export class GalleryView extends BookshelfBasesView {
    readonly type = GalleryViewType

    static override options(): Array<BasesAllOptions> {
        return [
            {
                type: 'dropdown',
                key: CONFIG_SHOW_READING_PROGRESS,
                displayName: 'Show reading progress',
                options: {
                    never: 'Never',
                    always: 'Always',
                    'only-reading': 'Only reading',
                },
                default: 'only-reading',
            },
        ]
    }

    protected render(items: GroupedData<Array<BookViewItem>> | Array<BookViewItem>): void {
        this.root.render(
            <StrictMode>
                <div className={styles.container}>
                    <Gallery
                        items={items}
                        onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                        progressBar={this.config.get(CONFIG_SHOW_READING_PROGRESS) as ProgressBarOptions}
                    />
                </div>
            </StrictMode>,
        )
    }

    protected bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem {
        return {
            book: this.bookshelf.book(this.notes.noteByFile(entry.file)),
            fields: [...this.data.properties.map((id) => this.bookViewFieldFromBasesPropertyId(entry, id))],
        }
    }
}
