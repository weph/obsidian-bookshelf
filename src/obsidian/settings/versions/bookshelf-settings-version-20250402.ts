import { NoteType } from '../bookshelf-plugin-settings'
import { VersionedSettings } from './migrated-settings'

export const VERSION = 20250402

export interface BookshelfPluginSettings extends VersionedSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
        pages: string
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
        pages: 'pages',
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

export function migratedSettings(settings: VersionedSettings): VersionedSettings {
    return settings
}
