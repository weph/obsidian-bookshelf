import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book/book'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { useSyncedData } from '../../component/hooks/use-synced-data'

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
                <SyncedBookDetails
                    bookshelf={this.bookshelf}
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

function SyncedBookDetails({
    bookshelf,
    book,
    openNote,
}: {
    bookshelf: Bookshelf
    book: Book
    openNote: (book: Book) => void
}) {
    useSyncedData(bookshelf, (b) => Array.from(b.all()))

    return (
        <BookDetails
            book={book}
            openNote={openNote}
            addProgress={async (item) => await bookshelf.addToReadingJourney(item)}
        />
    )
}
