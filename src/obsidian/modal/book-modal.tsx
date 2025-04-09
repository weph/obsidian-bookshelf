import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book/book'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'
import { Bookshelf } from '../../bookshelf/bookshelf'

export class BookModal extends Modal {
    private root: Root

    constructor(
        app: App,
        private readonly bookshelf: Bookshelf,
        private readonly book: Book,
    ) {
        super(app)

        this.root = createRoot(this.contentEl)

        this.update()
    }

    public update(): void {
        this.setTitle('Book details')

        this.root.render(
            <StrictMode>
                <BookDetails
                    book={this.book}
                    openNote={async () => {
                        this.close()

                        if (this.book.note) {
                            await this.app.workspace.openLinkText(this.book.note.basename, '')
                        }
                    }}
                    addProgress={async (item) => await this.bookshelf.addToReadingJourney(item)}
                />
            </StrictMode>,
        )
    }
}
