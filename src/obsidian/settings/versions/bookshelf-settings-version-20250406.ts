import { NoteType } from '../bookshelf-plugin-settings'
import { assign } from 'radashi'
import { BookshelfPluginSettings as PreviousSettings } from './bookshelf-settings-version-20250402'
import { VersionedSettings } from './migrated-settings'

export const VERSION = 20250406

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
    settingsVersion: VERSION,
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
            absoluteProgress: '{date}: {start}-{end}',
            relativeProgress: '{date}: {end}',
        },
    },
    dailyNote: {
        enabled: true,
        heading: 'Reading',
        patterns: {
            started: 'Started {book}',
            finished: 'Finished {book}',
            abandoned: 'Abandoned {book}',
            absoluteProgress: 'Read {book}: {start}-{end}',
            relativeProgress: 'Read {book}: {end}',
        },
    },
    readingProgress: {
        newEntryLocation: 'bookNote',
    },
}

export function migratedSettings(settings: VersionedSettings): BookshelfPluginSettings {
    const result = assign({ settingsVersion: VERSION }, settings as PreviousSettings)

    result.bookNote.patterns.absoluteProgress = result.bookNote.patterns.absoluteProgress
        .replace('{startPage}', '{start}')
        .replace('{endPage}', '{end}')

    result.bookNote.patterns.relativeProgress = result.bookNote.patterns.relativeProgress.replace('{endPage}', '{end}')

    result.dailyNote.patterns.absoluteProgress = result.dailyNote.patterns.absoluteProgress
        .replace('{startPage}', '{start}')
        .replace('{endPage}', '{end}')

    result.dailyNote.patterns.relativeProgress = result.dailyNote.patterns.relativeProgress.replace(
        '{endPage}',
        '{end}',
    )

    return result
}
