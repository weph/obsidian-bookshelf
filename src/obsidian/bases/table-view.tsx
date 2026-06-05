import { BookshelfBasesView } from './bookshelf-bases-view'
import { BookTable } from '../../component/library/view/table/table'
import { BasesAllOptions, BasesEntry } from 'obsidian'
import { BookViewField, BookViewItem } from '../../component/library/book-view-item'
import { cover, progress, status, title } from '../../component/library/view/render-functions'

const CONFIG_FIELDS_TITLE = 'field_title'
const CONFIG_FIELDS_COVER = 'field_cover'
const CONFIG_FIELDS_PROGRESS = 'field_progress'
const CONFIG_FIELDS_STATUS = 'field_status'

const configFields = [CONFIG_FIELDS_TITLE, CONFIG_FIELDS_COVER, CONFIG_FIELDS_PROGRESS, CONFIG_FIELDS_STATUS] as const

const viewFields: { [key in (typeof configFields)[number]]: BookViewField } = {
    [CONFIG_FIELDS_TITLE]: {
        name: 'Title',
        renderTo: title,
    },
    [CONFIG_FIELDS_COVER]: {
        name: 'Cover',
        renderTo: cover,
    },
    [CONFIG_FIELDS_PROGRESS]: {
        name: 'Progress',
        renderTo: progress,
    },
    [CONFIG_FIELDS_STATUS]: {
        name: 'Status',
        renderTo: status,
    },
}

export const TableViewType = 'bookshelf-table'

export class TableView extends BookshelfBasesView {
    readonly type = TableViewType
    override viewComponent = BookTable

    static override options(): Array<BasesAllOptions> {
        return [
            {
                type: 'group',
                displayName: 'Fields',
                items: Object.entries(viewFields).map(([key, value]) => ({
                    type: 'toggle',
                    key,
                    displayName: value.name,
                })),
            },
        ]
    }

    protected bookViewItemFromBasesEntry(entry: BasesEntry): BookViewItem {
        return {
            book: this.bookshelf.book(this.notes.noteByFile(entry.file)),
            fields: [
                ...configFields.filter((f) => this.config.get(f)).map((f) => viewFields[f]),
                ...this.data.properties.map((id) => this.bookViewFieldFromBasesPropertyId(entry, id)),
            ],
        }
    }
}
