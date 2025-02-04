export interface BookshelfPluginSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
    }
}

export const DEFAULT_SETTINGS: Partial<BookshelfPluginSettings> = {
    booksFolder: 'Books',
    bookProperties: {
        cover: 'cover',
        author: 'author',
        published: 'published',
    },
}
