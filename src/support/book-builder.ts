import { Book } from '../book'

export class BookBuilder {
    private properties: Partial<Book>

    constructor(properties: Partial<Book> = {}) {
        this.properties = properties
    }

    public with<K extends keyof Book>(property: K, value: Book[K]): BookBuilder {
        return new BookBuilder({ ...this.properties, [property]: value })
    }

    public build(): Book {
        return {
            ...this.defaults(),
            ...this.properties,
        }
    }

    private defaults(): Book {
        return {
            title: 'Book Title',
        }
    }
}
