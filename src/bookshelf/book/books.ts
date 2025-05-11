import { Book } from './book'

export class Books {
    constructor(private readonly books: Array<Book>) {}

    get length(): number {
        return this.books.length
    }

    public map<U>(callback: (value: Book, index: number, array: Array<Book>) => U): Array<U> {
        return this.books.map(callback)
    }

    public filter(predicate: (value: Book, index: number, array: Array<Book>) => unknown): Books {
        return new Books(this.books.filter(predicate))
    }

    public sort(compare?: (a: Book, b: Book) => number): Books {
        return new Books([...this.books].sort(compare))
    }

    [Symbol.iterator](): Iterator<Book> {
        let current = 0

        return {
            next: (): IteratorResult<Book> => {
                if (current < this.books.length) {
                    return {
                        done: false,
                        value: this.books[current++],
                    }
                }

                return {
                    done: true,
                    value: null,
                }
            },
        }
    }
}
