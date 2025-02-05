import { Book } from './book'

export interface ReadingProgress {
    date: Date
    book: Book
    startPage: number
    endPage: number
    pages: number
}

export class AbsoluteReadingProgress implements ReadingProgress {
    constructor(
        public date: Date,
        public book: Book,
        public previous: ReadingProgress | null,
        public startPage: number,
        public endPage: number,
    ) {}

    get pages(): number {
        return this.endPage - this.startPage + 1
    }
}

export class RelativeReadingProgress implements ReadingProgress {
    constructor(
        public date: Date,
        public book: Book,
        public previous: ReadingProgress | null,
        public endPage: number,
    ) {}

    get startPage(): number {
        if (this.previous === null) {
            return 1
        }

        return this.previous.endPage + 1
    }

    get pages(): number {
        return this.endPage - this.startPage + 1
    }
}
