import { expect, test } from 'vitest'
import { migratedSettings } from './migrated-settings'
import { BookshelfPluginSettings as Settings20250402 } from './bookshelf-settings-version-20250402'

test("Don't do anything if settings are empty (first time running the plugin)", () => {
    expect(migratedSettings({})).toEqual({})
})

test('20250402 => 20250406', () => {
    const v0Settings: Settings20250402 = {
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
                started: '{date}: Started reading',
                abandoned: '{date}: Abandoned book',
                finished: '{date}: Finished reading',
                absoluteProgress: '{date}: {startPage}-{endPage}',
                relativeProgress: '{date}: {endPage}',
            },
        },
        dailyNote: {
            enabled: true,
            heading: 'Reading',
            patterns: {
                started: 'Started reading {book}',
                abandoned: 'Abandoned {book}',
                finished: 'Finished reading {book}',
                absoluteProgress: 'Read {book}: {startPage}-{endPage}',
                relativeProgress: 'Read {book}: {endPage}',
            },
        },
        readingProgress: {
            newEntryLocation: 'bookNote',
        },
    }

    expect(migratedSettings(v0Settings)).toEqual({
        settingsVersion: 20250406,
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
                started: '{date}: Started reading',
                abandoned: '{date}: Abandoned book',
                finished: '{date}: Finished reading',
                absoluteProgress: '{date}: {start}-{end}',
                relativeProgress: '{date}: {end}',
            },
        },
        dailyNote: {
            enabled: true,
            heading: 'Reading',
            patterns: {
                started: 'Started reading {book}',
                abandoned: 'Abandoned {book}',
                finished: 'Finished reading {book}',
                absoluteProgress: 'Read {book}: {start}-{end}',
                relativeProgress: 'Read {book}: {end}',
            },
        },
        readingProgress: {
            newEntryLocation: 'bookNote',
        },
    })
})
