export const BOOK_NOTE = 'bookNote'
export const DAILY_NOTE = 'dailyNote'

export const ALL_NOTES = [BOOK_NOTE, DAILY_NOTE] as const

export type NoteType = (typeof ALL_NOTES)[number]

export interface BookshelfPluginSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
        tags: string
        rating: string
    }
    bookNote: {
        enabled: boolean
        heading: string
        dateFormat: string
        patterns: {
            started: string
            finished: string
            abandoned: string
            absoluteProgress: string
            relativeProgress: string
        }
    }
    dailyNote: {
        enabled: boolean
        heading: string
        patterns: {
            started: string
            finished: string
            abandoned: string
            absoluteProgress: string
            relativeProgress: string
        }
    }
    readingProgress: {
        newEntryLocation: NoteType
    }
}

export const DEFAULT_SETTINGS: Partial<BookshelfPluginSettings> = {
    booksFolder: 'Books',
    bookProperties: {
        cover: 'cover',
        author: 'author',
        published: 'published',
        tags: 'tags',
        rating: 'rating',
    },
    bookNote: {
        enabled: true,
        heading: 'Reading Journey',
        dateFormat: 'yyyy-MM-dd',
        patterns: {
            started: '{date}: Started',
            finished: '{date}: Finished',
            abandoned: '{date}: Abandoned',
            absoluteProgress: '{date}: {startPage}-{endPage}',
            relativeProgress: '{date}: {endPage}',
        },
    },
    dailyNote: {
        enabled: true,
        heading: 'Reading',
        patterns: {
            started: 'Started {book}',
            finished: 'Finished {book}',
            abandoned: 'Abandoned {book}',
            absoluteProgress: 'Read {book}: {startPage}-{endPage}',
            relativeProgress: 'Read {book}: {endPage}',
        },
    },
    readingProgress: {
        newEntryLocation: 'bookNote',
    },
}
