import { App, Modal } from 'obsidian'
import { Book } from '../../book'

export class BookModal extends Modal {
    constructor(app: App, book: Book) {
        super(app)

        const content = document.createDocumentFragment()
        const div = content.createDiv()
        div.innerHTML = `
            ${book.authors?.length ? `<strong>by ${book.authors?.join(', ')}</strong>` : ''}
            <img src="${book.cover}" alt="${book.title}" width="100%" />
        `

        this.setTitle(book.title)
        this.setContent(content)
    }
}
