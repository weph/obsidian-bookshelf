import { Book, BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyLog } from './reading-journey/reading-journey-log'
import { Statistics } from './statistics'
import { ReadingJourney } from './reading-journey/reading-journey'

class BookshelfBook implements Book {
    constructor(
        public metadata: BookMetadata,
        private readonly bookshelf: Bookshelf,
    ) {}

    get readingJourney(): ReadingJourney {
        return this.bookshelf.readingJourney().filter((rp) => rp.book === this)
    }
}

export class Bookshelf {
    private books = new Map<string, Book>()

    private readingJourneyLog = new ReadingJourneyLog()

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

    public addActionToJourney(
        date: Date,
        identifier: string,
        action: 'started' | 'finished' | 'abandoned',
        source: string,
    ): void {
        this.readingJourneyLog.addActionToJourney(date, this.book(identifier), action, source)
    }

    public addReadingProgress(
        date: Date,
        identifier: string,
        endPage: number,
        startPage: number | null,
        source: string,
    ): void {
        this.readingJourneyLog.addReadingProgress(date, this.book(identifier), startPage || null, endPage, source)
    }

    public removeFromJourneyBySource(source: string): void {
        this.readingJourneyLog.removeBySource(source)
    }

    public readingJourney(): ReadingJourney {
        return this.readingJourneyLog.readingJourney()
    }

    public statistics(year: number | null = null): Statistics {
        const journey =
            year === null ? this.readingJourney() : this.readingJourney().filter((i) => i.date.getFullYear() === year)

        return new Statistics(journey)
    }
}
