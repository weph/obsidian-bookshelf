import { BookshelfBasesView } from './bookshelf-bases-view'
import { Gallery } from '../../component/library/view/gallery/gallery'
import { BasesAllOptions, BasesEntry } from 'obsidian'
import { BookViewItem } from '../../component/library/book-view-item'
import { progress } from '../../component/library/view/render-functions'

const CONFIG_PROGRESS_SHOW = 'progress_show'
const CONFIG_PROGRESS_ALWAYS = 'progress_always'

export const GalleryViewType = 'bookshelf-gallery'

export class GalleryView extends BookshelfBasesView {
    readonly type = GalleryViewType
    override viewComponent = Gallery

    static override options(): Array<BasesAllOptions> {
        return [
            {
                type: 'group',
                displayName: 'Progress',
                items: [
                    {
                        type: 'toggle',
                        key: CONFIG_PROGRESS_SHOW,
                        displayName: 'Show',
                        default: true,
                    },
                    {
                        type: 'toggle',
                        key: CONFIG_PROGRESS_ALWAYS,
                        displayName: 'Show always',
                        default: false,
                    },
                ],
            },
        ]
    }

    protected bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem {
        const book = this.bookshelf.book(this.notes.noteByFile(entry.file))

        const bookshelfFields = []
        if (this.config.get(CONFIG_PROGRESS_SHOW)) {
            if (this.config.get(CONFIG_PROGRESS_ALWAYS) || book.status === 'reading') {
                bookshelfFields.push({ name: '', renderTo: progress })
            }
        }

        return {
            book,
            fields: [
                ...bookshelfFields,
                ...this.data.properties.map((id) => this.bookViewFieldFromBasesPropertyId(entry, id)),
            ],
        }
    }
}
