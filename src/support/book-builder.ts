import { Book, BookMetadata } from '../book'
import { ReadingJourneyItem } from '../reading-journey'

export class BookBuilder {
    constructor(
        private readonly metadata: Partial<BookMetadata> = {},
        private readonly readingJourney: Array<Omit<ReadingJourneyItem, 'book'>> = [],
    ) {}

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder({ ...this.metadata, [property]: value }, this.readingJourney)
    }

    public withReadingProgress(date: Date, startPage: number, endPage: number): BookBuilder {
        const pages = endPage - startPage + 1

        return new BookBuilder(this.metadata, [
            ...this.readingJourney,
            { action: 'progress', date, startPage, endPage, pages: pages },
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
