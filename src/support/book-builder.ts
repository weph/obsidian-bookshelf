import { Book, BookMetadata } from '../bookshelf/book/book'
import { ReadingJourneyItem } from '../bookshelf/reading-journey/reading-journey-log'
import { ReadingJourney } from '../bookshelf/reading-journey/reading-journey'
import { Note } from '../bookshelf/note/note'
import { FakeNote } from './fake-note'
import { StaticMetadata } from '../bookshelf/note/metadata'
import { position } from '../bookshelf/reading-journey/position/position'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitUnion<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export class BookBuilder {
    constructor(
        private readonly note: Note | null = null,
        private readonly metadata: Partial<BookMetadata> = {},
        private readonly readingJourney: Array<OmitUnion<ReadingJourneyItem, 'book'>> = [],
    ) {}

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder(this.note, { ...this.metadata, [property]: value }, this.readingJourney)
    }

    public withReadingProgress(date: Date, startPage: number, endPage: number): BookBuilder {
        const pages = endPage - startPage + 1

        return new BookBuilder(this.note, this.metadata, [
            ...this.readingJourney,
            {
                action: 'progress',
                date,
                start: position(startPage),
                end: position(endPage),
                startPage,
                endPage,
                pages: pages,
                source: new FakeNote('', new StaticMetadata({}), []),
            },
        ])
    }

    public build(): Book {
        const book: Book = {
            note: this.note,
            metadata: {
                ...this.defaultMetadata(),
                ...this.metadata,
            },
            readingJourney: new ReadingJourney([]),
            status: 'unread',
        }

        book.readingJourney = new ReadingJourney(this.readingJourney.map((rp) => ({ ...rp, book })))

        return book
    }

    private defaultMetadata(): BookMetadata {
        return {
            title: 'Book Title',
        }
    }
}
