import { Book, BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyItemInput, ReadingJourneyLog } from './reading-journey/reading-journey-log'
import { Statistics } from './reading-journey/statistics/statistics'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note'
import { BookMetadataFactory } from './metadata/book-metadata-factory'
import { BookNoteMatch } from './reading-journey/pattern/book-note/book-note-pattern'
import { DailyNoteMatch } from './reading-journey/pattern/daily-note/daily-note-pattern'
import { PatternCollection } from './reading-journey/pattern/pattern-collection'
import { dailyNoteDate } from './daily-notes/daily-note-date'

interface DailyNoteSettings {
    heading: string
    format: string
    folder: string
}

interface BookNoteSettings {
    heading: string
}

class BookshelfBook implements Book {
    constructor(
        public readonly note: Note | null,
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
        private readonly dailyNoteSettings: DailyNoteSettings,
        private readonly bookNoteSettings: BookNoteSettings,
        private readonly bookMetadataFactory: BookMetadataFactory,
        private readonly bookNotePatterns: PatternCollection<BookNoteMatch>,
        private readonly dailyNotePatterns: PatternCollection<DailyNoteMatch>,
        private readonly bookIdentifier: (input: string) => string,
    ) {}

    public async process(note: Note): Promise<void> {
        await this.handleBookNote(note)
        await this.handleDailyNote(note)
    }

    public rename(oldIdentifier: string, newIdentifier: string): void {
        this.books.set(newIdentifier, this.book(oldIdentifier))
        this.books.delete(oldIdentifier)
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
            this.add(identifier, note, bookMetadata)
        }

        await this.processReadingJourney(
            note,
            this.bookNoteSettings.heading,
            this.bookNotePatterns,
            () => identifier,
            (matches) => matches.date,
        )
    }

    private async handleDailyNote(note: Note): Promise<void> {
        const date = dailyNoteDate(note.path, this.dailyNoteSettings.format, this.dailyNoteSettings.folder)
        if (date === null) {
            return
        }

        await this.processReadingJourney(
            note,
            this.dailyNoteSettings.heading,
            this.dailyNotePatterns,
            (matches) => this.bookIdentifier(matches.book),
            () => date,
        )
    }

    private isBookNote(note: Note): boolean {
        return note.path.startsWith(this.booksFolder)
    }

    private async processReadingJourney<T extends BookNoteMatch | DailyNoteMatch>(
        note: Note,
        heading: string,
        patterns: PatternCollection<T>,
        identifierValue: (matches: T) => string,
        dateValue: (matches: T) => Date,
    ): Promise<void> {
        const source = note.path

        this.readingJourneyLog.removeBySource(source)
        for await (const listItem of note.listItems(heading)) {
            const matches = patterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const identifier = identifierValue(matches)
            const date = dateValue(matches)

            if (!this.has(identifier)) {
                this.add(identifier, null, { title: identifier })
            }

            const book = this.book(identifier)

            let item: ReadingJourneyItemInput

            if (matches.action === 'relative-progress') {
                item = { ...matches, action: 'progress', date, book, source, startPage: null }
            } else if (matches.action === 'absolute-progress') {
                item = { ...matches, action: 'progress', date, book, source }
            } else {
                item = { ...matches, date, book, source }
            }

            this.readingJourneyLog.add(item)
        }
    }

    private has(identifier: string): boolean {
        return this.books.has(identifier)
    }

    private add(identifier: string, note: Note | null, metadata: BookMetadata): void {
        this.books.set(identifier, new BookshelfBook(note, metadata, this))
    }

    private update(identifier: string, metadata: BookMetadata): void {
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

    public readingJourney(): ReadingJourney {
        return this.readingJourneyLog.readingJourney()
    }

    public statistics(year: number | null = null): Statistics {
        return year === null
            ? this.readingJourney().statistics()
            : this.readingJourney()
                  .filter((i) => i.date.getFullYear() === year)
                  .statistics()
    }
}
