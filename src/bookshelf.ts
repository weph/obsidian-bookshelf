import { Book, BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyLog } from './reading-journey/reading-journey-log'
import { Statistics } from './statistics'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note'
import { BookMetadataFactory } from './book-metadata-factory'
import { BookNotePatternMatches } from './reading-journey/pattern/book-note/book-note-pattern'
import { DailyNotePatternMatches } from './reading-journey/pattern/daily-note/daily-note-pattern'
import { PatternCollection } from './reading-journey/pattern/pattern-collection'

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

    constructor(
        private readonly booksFolder: string,
        private readonly bookMetadataFactory: BookMetadataFactory,
        private readonly bookNotePatterns: PatternCollection<BookNotePatternMatches>,
        private readonly dailyNotePatterns: PatternCollection<DailyNotePatternMatches>,
        private readonly bookIdentifier: (input: string) => string,
    ) {}

    public async process(note: Note): Promise<void> {
        await this.handleBookNote(note)
        await this.handleDailyNote(note)
    }

    private async handleBookNote(note: Note): Promise<void> {
        if (!this.isBookNote(note)) {
            return
        }

        const identifier = note.identifier

        const bookMetadata = this.bookMetadataFactory.create(note.basename, note.metadata)
        if (this.has(identifier)) {
            this.update(identifier, bookMetadata)
        } else {
            this.add(identifier, bookMetadata)
        }

        await this.processReadingJourney(
            note,
            this.bookNotePatterns,
            () => identifier,
            (matches) => matches.date,
        )
    }

    private async handleDailyNote(note: Note): Promise<void> {
        const dateMatches = note.basename.match(/(\d{4})-(\d{2})-(\d{2})/)
        if (dateMatches === null) {
            return
        }

        const date = new Date(parseInt(dateMatches[1]), parseInt(dateMatches[2]) - 1, parseInt(dateMatches[3]))

        await this.processReadingJourney(
            note,
            this.dailyNotePatterns,
            (matches) => this.bookIdentifier(matches.book),
            () => date,
        )
    }

    private isBookNote(note: Note): boolean {
        return note.path.startsWith(this.booksFolder)
    }

    private async processReadingJourney<T extends BookNotePatternMatches | DailyNotePatternMatches>(
        note: Note,
        patterns: PatternCollection<T>,
        identifierValue: (matches: T) => string,
        dateValue: (matches: T) => Date,
    ): Promise<void> {
        const source = note.path

        this.removeFromJourneyBySource(source)
        for await (const listItem of note.listItems()) {
            const matches = patterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const identifier = identifierValue(matches)
            const date = dateValue(matches)

            if (!this.has(identifier)) {
                this.add(identifier, { title: identifier })
            }

            if (matches.action === 'progress') {
                this.addReadingProgress(date, identifier, matches.endPage, matches.startPage || null, source)
                continue
            }

            this.addActionToJourney(date, identifier, matches.action, source)
        }
    }

    private has(identifier: string): boolean {
        return this.books.has(identifier)
    }

    public add(identifier: string, metadata: BookMetadata): void {
        if (this.books.has(identifier)) {
            throw BookshelfError.identifierExists(identifier)
        }

        this.books.set(identifier, new BookshelfBook(metadata, this))
    }

    public update(identifier: string, metadata: BookMetadata): void {
        this.book(identifier).metadata = metadata
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
