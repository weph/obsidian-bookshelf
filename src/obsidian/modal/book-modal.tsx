import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'

export class BookModal extends Modal {
    constructor(app: App, book: Book) {
        super(app)

        this.setTitle(book.metadata.title)

        createRoot(this.contentEl).render(
            <StrictMode>
                <BookDetails
                    book={book}
                    openNote={async () => {
                        this.close()

                        if (book.note) {
                            await app.workspace.openLinkText(book.note.basename, '')
                        }
                    }}
                />
            </StrictMode>,
        )
    }
}
