import { Book, BookMetadata } from '../book'
import { ReadingJourneyItem } from '../reading-journey/reading-journey'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitUnion<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export class BookBuilder {
    constructor(
        private readonly metadata: Partial<BookMetadata> = {},
        private readonly readingJourney: Array<OmitUnion<ReadingJourneyItem, 'book'>> = [],
    ) {}

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder({ ...this.metadata, [property]: value }, this.readingJourney)
    }

    public withReadingProgress(date: Date, startPage: number, endPage: number): BookBuilder {
        const pages = endPage - startPage + 1

        return new BookBuilder(this.metadata, [
            ...this.readingJourney,
            { action: 'progress', date, startPage, endPage, pages: pages, source: '' },
        ])
    }

    public build(): Book {
        const book: Book = {
            metadata: {
                ...this.defaultMetadata(),
                ...this.metadata,
            },
            readingJourney: [],
        }

        book.readingJourney = this.readingJourney.map((rp) => ({ ...rp, book }))

        return book
    }

    private defaultMetadata(): BookMetadata {
        return {
            title: 'Book Title',
        }
    }
}
