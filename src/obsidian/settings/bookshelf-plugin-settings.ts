export interface BookshelfPluginSettings {
    booksFolder: string
    bookProperties: {
        cover: string
    }
}

export const DEFAULT_SETTINGS: Partial<BookshelfPluginSettings> = {
    booksFolder: 'Books',
    bookProperties: {
        cover: 'cover',
    },
}
