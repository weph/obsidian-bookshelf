import { Book } from '../book'

export type ReadingJourneyItem = ReadingJourneyItemAction | ReadingJourneyProgressItem

interface ReadingJournalItemBase {
    date: Date
    book: Book
    source: string
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

export class ReadingProgress implements ReadingJourneyProgressItem {
    public readonly action = 'progress'

    constructor(
        public readonly date: Date,
        public readonly book: Book,
        public previous: ReadingJourneyProgressItem | null,
        private readonly _startPage: number | null,
        public readonly endPage: number,
        public readonly source: string,
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
        source: string,
    ): void {
        this.items.splice(this.positionForDate(date), 0, { action, date, book, source })
    }

    public addReadingProgress(date: Date, book: Book, startPage: number | null, endPage: number, source: string): void {
        const pos = this.positionForDate(date)
        const previous = this.previousReadingProgress(book, pos)
        const item = new ReadingProgress(date, book, previous, startPage, endPage, source)

        this.items.splice(pos, 0, item)

        const next = this.nextReadingProgress(book, pos)
        if (next) {
            next.previous = item
        }
    }

    public removeBySource(source: string): void {
        this.items = this.items.filter((item) => item.source !== source)
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

    public readingJourney(): Array<ReadingJourneyItem> {
        return this.items
    }
}
