import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'

export class BookModal extends Modal {
    private root: Root

    constructor(
        app: App,
        private book: Book,
    ) {
        super(app)

        this.root = createRoot(this.containerEl.children[1])

        this.update()
    }

    public update(): void {
        this.setTitle(this.book.metadata.title)

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
                />
            </StrictMode>,
        )
    }
}
