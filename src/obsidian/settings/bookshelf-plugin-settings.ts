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
        heading: string
        patterns: {
            started: string
            finished: string
            abandoned: string
            absoluteProgress: string
            relativeProgress: string
        }
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
        heading: 'Reading',
        patterns: {
            started: 'Started {book}',
            finished: 'Finished {book}',
            abandoned: 'Abandoned {book}',
            absoluteProgress: 'Read {book}: {startPage}-{endPage}',
            relativeProgress: 'Read {book}: {endPage}',
        },
    },
}
