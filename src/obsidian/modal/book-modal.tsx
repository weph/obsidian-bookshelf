import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book/book'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { useSyncedData } from '../../component/hooks/use-synced-data'
import BookshelfPlugin from '../bookshelf-plugin'

export class BookModal extends Modal {
    constructor(
        app: App,
        private bookshelfPlugin: BookshelfPlugin,
        private readonly bookshelf: Bookshelf,
        private readonly book: Book,
    ) {
        super(app)

        this.setTitle('Book details')

        createRoot(this.contentEl).render(
            <StrictMode>
                <SyncedBookDetails
                    bookshelf={this.bookshelf}
                    book={this.book}
                    openNote={async () => {
                        this.close()
                        await this.bookshelfPlugin.openBookNote(this.book)
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
