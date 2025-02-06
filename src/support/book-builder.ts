import { Book, BookMetadata } from '../book'

export class BookBuilder {
    private metadata: Partial<BookMetadata>

    constructor(metadata: Partial<BookMetadata> = {}) {
        this.metadata = metadata
    }

    public with<K extends keyof BookMetadata>(property: K, value: BookMetadata[K]): BookBuilder {
        return new BookBuilder({ ...this.metadata, [property]: value })
    }

    public build(): Book {
        return {
            metadata: {
                ...this.defaultMetadata(),
                ...this.metadata,
            },
        }
    }

    private defaultMetadata(): BookMetadata {
        return {
            title: 'Book Title',
        }
    }
}
