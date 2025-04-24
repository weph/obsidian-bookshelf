import { Book } from './book/book'
import { Bookshelf } from './bookshelf'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Statistics } from './reading-journey/statistics/statistics'
import { Subscribers } from './subscriber/subscribers'

export class BookshelfDummy implements Bookshelf {
    constructor(private readonly subscribers: Subscribers) {}

    public async process(): Promise<void> {}

    public remove(): void {}

    public has(): boolean {
        return false
    }

    public book(): Book {
        throw new Error('Not implemented.')
    }

    public all(): Iterable<Book> {
        return []
    }

    public readingJourney(): ReadingJourney {
        return new ReadingJourney([])
    }

    public statistics(): Statistics {
        return this.readingJourney().statistics()
    }

    public async addToReadingJourney(): Promise<void> {}

    public subscribe(subscriber: () => void): () => void {
        return this.subscribers.add(subscriber)
    }
}
