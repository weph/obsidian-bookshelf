export interface BookshelfPluginSettings {
    booksFolder: string
}

export const DEFAULT_SETTINGS: Partial<BookshelfPluginSettings> = {
    booksFolder: 'Books',
}
