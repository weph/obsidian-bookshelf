import { Book, BookMetadata, ReadingStatus } from '../bookshelf/book/book'
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
        private readonly status: ReadingStatus = 'unread',
    ) {}

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder(this.note, { ...this.metadata, [property]: value }, this.readingJourney, this.status)
    }

    public withStatus(status: ReadingStatus): BookBuilder {
        return new BookBuilder(this.note, this.metadata, this.readingJourney, status)
    }

    public withReadingProgress(date: Date, startPage: number, endPage: number): BookBuilder {
        const pages = endPage - startPage + 1

        return new BookBuilder(
            this.note,
            this.metadata,
            [
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
            ],
            this.status,
        )
    }

    public build(): Book {
        const book: Book = {
            note: this.note || new FakeNote(`Books/${this.metadata.title}.md`, new StaticMetadata({}), []),
            metadata: {
                ...this.defaultMetadata(),
                ...this.metadata,
            },
            readingJourney: new ReadingJourney([]),
            status: this.status,
        }

        book.readingJourney = new ReadingJourney(this.readingJourney.map((rp) => ({ ...rp, book })))

        return book
    }

    private defaultMetadata(): BookMetadata {
        return {
            title: 'Book Title',
            authors: [],
            lists: [],
            links: [],
        }
    }
}
