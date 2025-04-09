import { Book, BookMetadata, ReadingStatus } from './book/book'
import { ReadingJourneyLog } from './reading-journey/reading-journey-log'
import { Statistics } from './reading-journey/statistics/statistics'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Note } from './note/note'
import { BookMetadataFactory } from './book/book-metadata-factory'
import { NoteProcessor, ReadingJourneyMatch } from './note-processing/note-processor'
import { ReadingJourneyWriter } from './note-processing/reading-journey-writer'

class BookshelfBook implements Book {
    constructor(
        public readonly note: Note | null,
        public readonly metadata: BookMetadata,
        private readonly bookshelf: Bookshelf,
    ) {}

    get readingJourney(): ReadingJourney {
        return this.bookshelf.readingJourney().filter((rp) => rp.book === this)
    }

    get status(): ReadingStatus {
        switch (this.readingJourney.lastItem()?.action) {
            case 'started':
                return 'reading'
            case 'finished':
                return 'finished'
            case 'abandoned':
                return 'abandoned'
            case 'progress':
                return 'reading'
            default:
                return 'unread'
        }
    }
}

export class Bookshelf {
    private bookNotes = new WeakMap<Note, Book>()
    private books: Array<Book> = []

    private readingJourneyLog = new ReadingJourneyLog()

    constructor(
        private readonly bookMetadataFactory: BookMetadataFactory,
        private readonly noteProcessor: NoteProcessor,
        private readonly readingJourneyWriter: ReadingJourneyWriter,
    ) {}

    public async process(note: Note): Promise<void> {
        const result = await this.noteProcessor.data(note)

        for (const bookNote of result.referencedBookNotes) {
            this.add(bookNote)
        }

        this.readingJourneyLog.removeBySource(note)
        for (const item of result.readingJourney) {
            this.readingJourneyLog.add({ ...item, book: this.book(item.bookNote), source: note })
        }
    }

    public remove(note: Note): void {
        const book = this.bookNotes.get(note)
        if (book === undefined) {
            return
        }

        this.books.splice(this.books.indexOf(book), 1)
        this.readingJourneyLog.removeByBook(book)
    }

    public has(note: Note): boolean {
        return this.bookNotes.has(note)
    }

    private add(note: Note): void {
        if (this.has(note)) {
            return
        }

        const book = new BookshelfBook(note, this.bookMetadataFactory.create(note), this)

        this.bookNotes.set(note, book)
        this.books.push(book)
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

    public async addToReadingJourney(item: ReadingJourneyMatch): Promise<void> {
        await this.process(await this.readingJourneyWriter.add(item))
    }
}
