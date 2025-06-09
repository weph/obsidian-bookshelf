import { VersionedSettings } from './versions/migrated-settings'

export const BOOK_NOTE = 'bookNote'
export const DAILY_NOTE = 'dailyNote'

export const ALL_NOTES = [BOOK_NOTE, DAILY_NOTE] as const

export type NoteType = (typeof ALL_NOTES)[number]

export const VERSION = 20250408

export interface BookshelfPluginSettings extends VersionedSettings {
    booksFolder: string
    bookProperties: {
        cover: string
        author: string
        published: string
        pages: string
        tags: string
        rating: string
        lists: string
        comment: string
        links: string
        series: string
        positionInSeries: string
        duration: string
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
    previousVersion: string
    showReleaseNotes: boolean
}

export const DEFAULT_SETTINGS: BookshelfPluginSettings = {
    settingsVersion: VERSION,
    booksFolder: 'Books',
    bookProperties: {
        cover: 'cover',
        author: 'author',
        published: 'published',
        pages: 'pages',
        tags: 'tags',
        rating: 'rating',
        lists: 'lists',
        comment: 'comment',
        links: 'links',
        series: 'series',
        positionInSeries: 'position-in-series',
        duration: 'duration',
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
    previousVersion: '0.0.0',
    showReleaseNotes: true,
}
