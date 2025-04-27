import { App, Modal } from 'obsidian'
import { Book } from '../../bookshelf/book/book'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BookDetails } from '../../component/book-details/book-details'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { useSyncedData } from '../../component/hooks/use-synced-data'
import BookshelfPlugin from '../bookshelf-plugin'
import { Link } from '../../bookshelf/book/link'

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
                    openLink={async (book: Book | Link) => {
                        this.close()
                        await this.bookshelfPlugin.openLink(book)
                    }}
                />
            </StrictMode>,
        )
    }
}

function SyncedBookDetails({
    bookshelf,
    book,
    openLink,
}: {
    bookshelf: Bookshelf
    book: Book
    openLink: (book: Book | Link) => void
}) {
    useSyncedData(bookshelf, (b) => Array.from(b.all()))

    return (
        <BookDetails
            book={book}
            openLink={openLink}
            addProgress={async (item) => await bookshelf.addToReadingJourney(item)}
        />
    )
}
