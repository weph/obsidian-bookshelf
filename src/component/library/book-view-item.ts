import { Book } from '../../bookshelf/book/book'

export interface BookViewField {
    name: string
    renderTo: (element: HTMLElement) => void
}

export interface BookViewItem {
    book: Book
    fields: Array<BookViewField>
}
