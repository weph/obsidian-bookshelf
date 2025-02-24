import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book'
import '../../component/book-details/book-details'

export class BookModal extends Modal {
    constructor(app: App, book: Book) {
        super(app)

        const content = document.createDocumentFragment()

        const component = content.createEl('bookshelf-book-details')
        component.book = book
        component.openNote = async () => {
            this.close()

            if (book.note) {
                await app.workspace.openLinkText(book.note.basename, '')
            }
        }

        this.setTitle(book.metadata.title)
        this.setContent(content)
    }
}
