import { BookshelfBasesView } from './bookshelf-bases-view'
import { BookTable } from '../../component/library/table/table'
import { BasesAllOptions, BasesEntry } from 'obsidian'
import { BookViewField, BookViewItem } from '../../component/library/book-view-item'
import { createRoot } from 'react-dom/client'
import { BookProgressBar } from '../../component/progress-bar/book-progress-bar'

const CONFIG_FIELDS_TITLE = 'field_title'
const CONFIG_FIELDS_COVER = 'field_cover'
const CONFIG_FIELDS_PROGRESS = 'field_progress'
const CONFIG_FIELDS_STATUS = 'field_status'

export const TableViewType = 'bookshelf-table'

export class TableView extends BookshelfBasesView {
    readonly type = TableViewType
    override viewComponent = BookTable

    static override options(): Array<BasesAllOptions> {
        return [
            {
                type: 'group',
                displayName: 'Fields',
                items: [
                    {
                        type: 'toggle',
                        key: CONFIG_FIELDS_TITLE,
                        displayName: 'Title',
                    },
                    {
                        type: 'toggle',
                        key: CONFIG_FIELDS_COVER,
                        displayName: 'Cover',
                    },
                    {
                        type: 'toggle',
                        key: CONFIG_FIELDS_PROGRESS,
                        displayName: 'Progress',
                    },
                    {
                        type: 'toggle',
                        key: CONFIG_FIELDS_STATUS,
                        displayName: 'Status',
                    },
                ],
            },
        ]
    }

    protected bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem {
        const book = this.bookshelf.book(this.notes.noteByFile(entry.file))

        const bookshelfFields: Array<BookViewField> = []
        if (this.config.get(CONFIG_FIELDS_TITLE)) {
            bookshelfFields.push({
                name: 'Title',
                renderTo: (e) => (e.innerText = book.metadata.title),
            })
        }

        if (this.config.get(CONFIG_FIELDS_COVER)) {
            bookshelfFields.push({
                name: 'Cover',
                renderTo: (e) => createRoot(e.createDiv()).render(<img src={book.metadata.cover} />),
            })
        }

        if (this.config.get(CONFIG_FIELDS_PROGRESS)) {
            bookshelfFields.push({
                name: 'Progress',
                renderTo: (e) => createRoot(e.createDiv()).render(<BookProgressBar book={book} />),
            })
        }

        if (this.config.get(CONFIG_FIELDS_STATUS)) {
            bookshelfFields.push({
                name: 'Status',
                renderTo: (e) => (e.innerText = book.status),
            })
        }

        return {
            book: book,
            fields: [
                ...bookshelfFields,
                ...this.data.properties.map((id) => this.bookViewFieldFromBasesPropertyId(entry, id)),
            ],
        }
    }
}
