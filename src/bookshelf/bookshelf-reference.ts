import { Note } from './note/note'
import { Book } from './book/book'
import { ReadingJourney } from './reading-journey/reading-journey'
import { Statistics } from './reading-journey/statistics/statistics'
import { ReadingJourneyMatch } from './note-processing/note-processor'
import { Bookshelf } from './bookshelf'

export class BookshelfReference implements Bookshelf {
    constructor(private bookshelf: Bookshelf) {}

    public replaceInstance(bookshelf: Bookshelf): void {
        this.bookshelf = bookshelf
    }

    public async process(note: Note): Promise<void> {
        await this.bookshelf.process(note)
    }

    public remove(note: Note): void {
        this.bookshelf.remove(note)
    }

    public has(note: Note): boolean {
        return this.bookshelf.has(note)
    }

    public book(note: Note): Book {
        return this.bookshelf.book(note)
    }

    public all(): Iterable<Book> {
        return this.bookshelf.all()
    }

    public readingJourney(): ReadingJourney {
        return this.bookshelf.readingJourney()
    }

    public statistics(year?: number): Statistics {
        return this.bookshelf.statistics(year)
    }

    public async addToReadingJourney(item: ReadingJourneyMatch): Promise<void> {
        await this.bookshelf.addToReadingJourney(item)
    }
}
