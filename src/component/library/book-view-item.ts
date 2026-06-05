import { Book } from '../../bookshelf/book/book'
import { RenderFunction } from './view/render-functions'

export interface BookViewField {
    name: string
    renderTo: RenderFunction
}

export interface BookViewItem {
    book: Book
    fields: Array<BookViewField>
}
