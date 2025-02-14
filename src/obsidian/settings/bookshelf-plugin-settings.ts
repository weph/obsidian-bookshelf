export interface BookshelfPluginSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
        tags: string
    }
    bookNote: {
        dateFormat: string
        patterns: {
            started: Array<string>
            finished: Array<string>
            abandoned: Array<string>
            progress: Array<string>
        }
    }
    dailyNote: {
        patterns: {
            started: Array<string>
            finished: Array<string>
            abandoned: Array<string>
            progress: Array<string>
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
    },
    bookNote: {
        dateFormat: 'yyyy-MM-dd',
        patterns: {
            started: ['{date}: Started'],
            finished: ['{date}: Finished'],
            abandoned: ['{date}: Abandoned'],
            progress: ['{date}: {endPage}', '{date}: {startPage}-{endPage}'],
        },
    },
    dailyNote: {
        patterns: {
            started: ['Started: {book}'],
            finished: ['Finished: {book}'],
            abandoned: ['Abandoned: {book}'],
            progress: ['Read {book}: {endPage}', 'Read {book}: {startPage}-{endPage}'],
        },
    },
}
