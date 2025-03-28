import { Book } from '../book'
import { ReadingJourney } from './reading-journey'
import { Note } from '../note'

interface ReadingJournalItemBase {
    date: Date
    book: Book
    source: Note
}

export interface ReadingJourneyItemAction extends ReadingJournalItemBase {
    action: 'started' | 'finished' | 'abandoned'
}

export interface ReadingJourneyProgressItem extends ReadingJournalItemBase {
    action: 'progress'
    startPage: number
    endPage: number
    pages: number
}

export type ReadingJourneyItem = ReadingJourneyItemAction | ReadingJourneyProgressItem

type ReadingJourneyItemActionInput = ReadingJourneyItemAction

interface ReadingJourneyItemProgressInput extends ReadingJournalItemBase {
    action: 'progress'
    startPage: number | null
    endPage: number
}

export type ReadingJourneyItemInput = ReadingJourneyItemActionInput | ReadingJourneyItemProgressInput

export class ReadingProgress implements ReadingJourneyProgressItem {
    public readonly action = 'progress'

    constructor(
        public readonly date: Date,
        public readonly book: Book,
        public previous: ReadingJourneyProgressItem | null,
        private readonly _startPage: number | null,
        public readonly endPage: number,
        public readonly source: Note,
    ) {}

    get startPage(): number {
        if (this._startPage) {
            return this._startPage
        }

        if (this.previous === null) {
            return 1
        }

        return this.previous.endPage + 1
    }

    get pages(): number {
        return this.endPage - this.startPage + 1
    }
}

export class ReadingJourneyLog {
    private items: Array<ReadingJourneyItemAction | ReadingProgress> = []

    public addActionToJourney(
        date: Date,
        book: Book,
        action: 'started' | 'finished' | 'abandoned',
        source: Note,
    ): void {
        this.add({ action, date, book, source })
    }

    public addReadingProgress(date: Date, book: Book, startPage: number | null, endPage: number, source: Note): void {
        this.add({ action: 'progress', date, book, source, startPage, endPage })
    }

    public add(item: ReadingJourneyItemInput): void {
        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return this.addAction(item)
            case 'progress':
                return this.addProgress(item)
        }
    }

    private addAction(item: ReadingJourneyItemActionInput): void {
        const { date, action, book, source } = item

        this.items.splice(this.positionForDate(date), 0, { action, date, book, source })
    }

    public addProgress(input: ReadingJourneyItemProgressInput): void {
        const { date, book, source, startPage, endPage } = input

        const pos = this.positionForDate(date)
        const previous = this.previousReadingProgress(book, pos)
        const item = new ReadingProgress(date, book, previous, startPage || null, endPage, source)

        this.items.splice(pos, 0, item)

        const next = this.nextReadingProgress(book, pos)
        if (next) {
            next.previous = item
        }
    }

    public removeBySource(source: Note): void {
        this.items = this.items.filter((item) => item.source !== source)
    }

    public removeByBook(book: Book): void {
        this.items = this.items.filter((item) => item.book !== book)
    }

    private positionForDate(date: Date): number {
        let pos = 0

        while (pos < this.items.length && this.items[pos].date.getTime() <= date.getTime()) {
            ++pos
        }

        return pos
    }

    private previousReadingProgress(book: Book, position: number): ReadingProgress | null {
        for (let i = position - 1; i >= 0; i--) {
            const item = this.items[i]
            if (item.action === 'progress' && item.book === book) {
                return item
            }
        }

        return null
    }

    private nextReadingProgress(book: Book, position: number): ReadingProgress | null {
        for (let i = position + 1; i < this.items.length; i++) {
            const item = this.items[i]
            if (item.action === 'progress' && item.book === book) {
                return item
            }
        }

        return null
    }

    public readingJourney(): ReadingJourney {
        return new ReadingJourney(this.items)
    }
}
