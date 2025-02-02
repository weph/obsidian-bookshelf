import { App, Modal } from 'obsidian'
import { Book } from '../../book'

export class BookModal extends Modal {
    constructor(app: App, book: Book) {
        super(app)

        this.setTitle(book.title)
    }
}
