import { App, Modal } from 'obsidian'
import { Book } from '../../book'
import '../../component/book-details/book-details'

export class BookModal extends Modal {
    constructor(app: App, book: Book) {
        super(app)

        const content = document.createDocumentFragment()

        const component = content.createEl('bookshelf-book-details')
        component.book = book

        this.setTitle(book.title)
        this.setContent(content)
    }
}
