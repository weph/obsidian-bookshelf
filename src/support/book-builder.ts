import { Book, BookMetadata } from '../book'
import { ReadingProgress } from '../reading-progress'

export class BookBuilder {
    constructor(
        private readonly metadata: Partial<BookMetadata> = {},
        private readonly readingProgress: Array<Omit<ReadingProgress, 'book'>> = [],
    ) {}

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder({ ...this.metadata, [property]: value }, this.readingProgress)
    }

    public withReadingProgress(date: Date, startPage: number, endPage: number): BookBuilder {
        const pages = endPage - startPage + 1

        return new BookBuilder(this.metadata, [...this.readingProgress, { date, startPage, endPage, pages: pages }])
    }

    public build(): Book {
        const book: Book = {
            metadata: {
                ...this.defaultMetadata(),
                ...this.metadata,
            },
            readingProgress: [],
        }

        book.readingProgress = this.readingProgress.map((rp) => ({ ...rp, book }))

        return book
    }

    private defaultMetadata(): BookMetadata {
        return {
            title: 'Book Title',
        }
    }
}
