import { BookshelfBasesView } from './bookshelf-bases-view'
import { BookTable } from '../../component/library/table/table'

export const TableViewType = 'bookshelf-table'

export class TableView extends BookshelfBasesView {
    readonly type = TableViewType
    override viewComponent = BookTable
}
