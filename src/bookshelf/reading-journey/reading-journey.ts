import { ReadingJourneyItem } from './reading-journey-log'
import { Book } from '../book/book'
import { Statistics } from './statistics/statistics'
import { Books } from '../book/books'

export class ReadingJourney {
    private _books: Books | null = null

    constructor(private _items: Array<ReadingJourneyItem>) {}

    public items(): Array<ReadingJourneyItem> {
        return this._items
    }

    public empty(): boolean {
        return this._items.length === 0
    }

    public lastItem(): ReadingJourneyItem | null {
        return this._items[this._items.length - 1] || null
    }

    public filter(predicate: (value: ReadingJourneyItem) => boolean): ReadingJourney {
        return new ReadingJourney(this._items.filter(predicate))
    }

    public map<T>(callback: (item: ReadingJourneyItem, index: number) => T): Array<T> {
        return this._items.map(callback)
    }

    public books(): Books {
        if (this._books === null) {
            const result = new Set<Book>()

            for (const item of this._items) {
                result.add(item.book)
            }

            this._books = new Books(Array.from(result))
        }

        return this._books
    }

    public frequencyMap<T>(keys: (book: Book) => undefined | T | Array<T>): Map<T, number> {
        const result = new Map()

        for (const book of this.books()) {
            const bookKeys = keys(book)

            if (bookKeys === undefined) {
                continue
            }

            for (const key of Array.isArray(bookKeys) ? bookKeys : [bookKeys]) {
                result.set(key, (result.get(key) || 0) + 1)
            }
        }

        return result
    }

    public statistics(): Statistics {
        return new Statistics(this)
    }
}
