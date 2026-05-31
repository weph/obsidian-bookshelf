import { BookshelfBasesView } from './bookshelf-bases-view'
import { Gallery } from '../../component/library/gallery/gallery'
import { BasesEntry } from 'obsidian'
import { BookViewItem } from '../../component/library/book-view-item'

export const GalleryViewType = 'bookshelf-gallery'

export class GalleryView extends BookshelfBasesView {
    readonly type = GalleryViewType
    override viewComponent = Gallery

    protected bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem {
        return {
            book: this.bookshelf.book(this.notes.noteByFile(entry.file)),
            fields: this.data.properties.map((id) => this.bookViewFieldFromBasesPropertyId(entry, id)),
        }
    }
}
