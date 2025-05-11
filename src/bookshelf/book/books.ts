import { Book, ReadingStatus } from './book'

interface Query {
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
        return this.filter((b) => {
            if (query.status !== null && b.status !== query.status) {
                return false
            }

            if (query.list !== null && !b.metadata.lists.includes(query.list)) {
                return false
            }

            const searchableFields = [b.metadata.title.toLowerCase()]
            const series = b.metadata.series
            if (series) {
                searchableFields.push(series.name.toString())
            }

            searchableFields.push(...b.metadata.authors.map((a) => a.toString()))

            return searchableFields.some((f) => f.toLowerCase().includes(query.search.toLowerCase()))
        })
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
