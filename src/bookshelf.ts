import { Book, BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import {
    AbsoluteReadingProgress,
    ReadingJourneyItem,
    ReadingJourneyItemAction,
    RelativeReadingProgress,
} from './reading-journey'
import { Statistics } from './statistics'

class BookshelfBook implements Book {
    constructor(
        public metadata: BookMetadata,
        private readonly bookshelf: Bookshelf,
    ) {}

    get readingJourney(): Array<ReadingJourneyItem> {
        return this.bookshelf.readingJourney().filter((rp) => rp.book === this)
    }
}

export class Bookshelf {
    private books = new Map<string, Book>()

    private readingJourneyItems: Array<ReadingJourneyItemAction | AbsoluteReadingProgress | RelativeReadingProgress> =
        []

    public has(identifier: string): boolean {
        return this.books.has(identifier)
    }

    public add(identifier: string, metadata: BookMetadata): void {
        if (this.books.has(identifier)) {
            throw BookshelfError.identifierExists(identifier)
        }

        this.books.set(identifier, new BookshelfBook(metadata, this))
    }

    public book(identifier: string): Book {
        const result = this.books.get(identifier)

        if (result === undefined) {
            throw BookshelfError.identifierDoesntExist(identifier)
        }

        return result
    }

    public all(): Iterable<Book> {
        return this.books.values()
    }

    public addActionToJourney(date: Date, identifier: string, action: 'started' | 'finished' | 'abandoned'): void {
        const book = this.book(identifier)

        let pos = 0
        while (
            pos < this.readingJourneyItems.length &&
            this.readingJourneyItems[pos].date.getTime() <= date.getTime()
        ) {
            ++pos
        }

        this.readingJourneyItems.splice(pos, 0, { action, date, book })
    }

    public addReadingProgress(date: Date, identifier: string, endPage: number, startPage?: number): void {
        const book = this.book(identifier)

        let pos = 0
        while (
            pos < this.readingJourneyItems.length &&
            this.readingJourneyItems[pos].date.getTime() <= date.getTime()
        ) {
            ++pos
        }

        const previous = this.previousReadingProgress(book, pos)

        const item =
            startPage !== undefined
                ? new AbsoluteReadingProgress(date, book, previous, startPage, endPage)
                : new RelativeReadingProgress(date, book, previous, endPage)

        this.readingJourneyItems.splice(pos, 0, item)

        const next = this.nextReadingProgress(book, pos)
        if (next) {
            next.previous = item
        }
    }

    private previousReadingProgress(
        book: Book,
        position: number,
    ): AbsoluteReadingProgress | RelativeReadingProgress | null {
        for (let i = position - 1; i >= 0; i--) {
            const item = this.readingJourneyItems[i]
            if (item.action === 'progress' && item.book === book) {
                return item
            }
        }

        return null
    }

    private nextReadingProgress(
        book: Book,
        position: number,
    ): AbsoluteReadingProgress | RelativeReadingProgress | null {
        for (let i = position + 1; i < this.readingJourneyItems.length; i++) {
            const item = this.readingJourneyItems[i]
            if (item.action === 'progress' && item.book === book) {
                return item
            }
        }

        return null
    }

    public readingJourney(): Array<ReadingJourneyItem> {
        return this.readingJourneyItems
    }

    public statistics(year: number | null = null): Statistics {
        const items =
            year === null
                ? this.readingJourneyItems
                : this.readingJourneyItems.filter((i) => i.date.getFullYear() === year)

        return new Statistics(items)
    }
}
