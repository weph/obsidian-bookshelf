export interface BookshelfPluginSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
    }
    bookNote: {
        dateFormat: string
        patterns: {
            progress: Array<string>
        }
    }
    dailyNote: {
        patterns: {
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
    },
    bookNote: {
        dateFormat: 'yyyy-MM-dd',
        patterns: {
            progress: ['{date}: {endPage}', '{date}: {startPage}-{endPage}'],
        },
    },
    dailyNote: {
        patterns: {
            progress: ['Read {book}: {endPage}', 'Read {book}: {startPage}-{endPage}'],
        },
    },
}
