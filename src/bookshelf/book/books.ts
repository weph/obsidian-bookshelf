import { Book, ReadingStatus } from './book'
import { FieldFilter } from './search/field-filter'
import { Contains } from './search/contains'
import { And } from './search/and'
import { ReadingStatusFilter } from './search/reading-status-filter'

export interface Query {
    search: string
    list: string | null
    status: ReadingStatus | null
}

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

    public matching(query: Query): Books {
        const expressions = []

        if (query.status !== null) {
            expressions.push(new ReadingStatusFilter(query.status))
        }

        if (query.list !== null) {
            expressions.push(new FieldFilter('lists', query.list))
        }

        if (query.search !== '') {
            expressions.push(new Contains(query.search))
        }

        if (expressions.length === 0) {
            return new Books(this.books)
        }

        const expr = new And(expressions)

        return this.filter((b) => expr.matches(b))
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
