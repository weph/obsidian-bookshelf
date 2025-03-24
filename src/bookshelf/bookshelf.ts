import { Book, BookMetadata, ReadingStatus } from './book'
import { ReadingJourneyLog } from './reading-journey/reading-journey-log'
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

    get status(): ReadingStatus {
        const items = this.bookshelf
            .readingJourney()
            .filter((rp) => rp.book === this)
            .items()
        if (items.length === 0) {
            return 'unread'
        }

        switch (items[items.length - 1].action) {
            case 'started':
                return 'reading'
            case 'finished':
                return 'finished'
            case 'abandoned':
                return 'abandoned'
            case 'progress':
                return 'reading'
        }
    }
}

export class Bookshelf {
    private bookNotes = new WeakMap<Note, Book>()
    private books: Array<Book> = []

    private readingJourneyLog = new ReadingJourneyLog()

    constructor(
        private readonly booksFolder: string,
        private readonly dailyNoteSettings: DailyNoteSettings,
        private readonly bookNoteSettings: BookNoteSettings,
        private readonly bookMetadataFactory: BookMetadataFactory,
        private readonly bookNotePatterns: PatternCollection<BookNoteMatch>,
        private readonly dailyNotePatterns: PatternCollection<DailyNoteMatch>,
        private readonly noteForLink: (input: string) => Note | null,
    ) {}

    public async process(note: Note): Promise<void> {
        await this.handleBookNote(note)
        await this.handleDailyNote(note)
    }

    private async handleBookNote(note: Note): Promise<void> {
        if (!this.isBookNote(note)) {
            return
        }

        const bookMetadata = this.bookMetadataFactory.create(note.basename, note.metadata)
        if (this.has(note)) {
            this.update(note, bookMetadata)
        } else {
            this.add(note, bookMetadata)
        }

        await this.processReadingJourney(
            note,
            this.bookNoteSettings.heading,
            this.bookNotePatterns,
            () => note,
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
            (matches) => this.noteForLink(matches.book),
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
        noteForLink: (matches: T) => Note | null,
        dateValue: (matches: T) => Date,
    ): Promise<void> {
        const source = note

        this.readingJourneyLog.removeBySource(source)
        for await (const listItem of note.listItems(heading)) {
            const matches = patterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const bookNote = noteForLink(matches)
            if (bookNote === null) {
                continue
            }

            const date = dateValue(matches)

            if (!this.has(bookNote)) {
                this.add(bookNote, { title: bookNote.basename })
            }

            const book = this.book(bookNote)

            this.readingJourneyLog.add({ ...matches, date, book, source })
        }
    }

    private has(note: Note): boolean {
        return this.bookNotes.has(note)
    }

    private add(note: Note, metadata: BookMetadata): void {
        if (this.has(note)) {
            return
        }

        const book = new BookshelfBook(note, metadata, this)

        this.bookNotes.set(note, book)
        this.books.push(book)
    }

    private update(note: Note, metadata: BookMetadata): void {
        this.book(note).metadata = metadata
    }

    public book(note: Note): Book {
        const result = this.bookNotes.get(note)

        if (result === undefined) {
            throw new Error(`There is no book for note "${note.path}"`)
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
