import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Bookshelf } from './bookshelf'
import { ReadingJourneyItem } from './reading-journey/reading-journey-log'
import { Interval } from './reading-journey/statistics/statistics'
import { DateTime } from 'luxon'
import { FakeNote } from '../support/fake-note'
import { StaticMetadata } from './note/metadata'
import { BookshelfFactory, Configuration } from './bookshelf-factory'
import { InMemoryNotes } from '../support/in-memory-notes'
import { position } from './reading-journey/position/position'
import { Book, BookMetadata } from './book/book'
import { Link } from './book/link'

let bookshelf: Bookshelf

const nonExistingNote = 'Non-existing Note'
const notes: InMemoryNotes = new InMemoryNotes()

const defaultConfiguration: Configuration = {
    settings: {
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
        previousVersion: '0.0.0',
        showReleaseNotes: true,
    },
    dailyNotesSettings: {
        enabled: true,
        format: 'YYYY-MM-DD',
        folder: '',
    },
    notes,
    linkToUri: (link) => link,
}

beforeEach(() => {
    notes.reset()

    bookshelf = BookshelfFactory.fromConfiguration(defaultConfiguration)
})

describe('Note processing', () => {
    test('It should ignore unrelated notes', async () => {
        await bookshelf.process(new FakeNote('Reading List.md', new StaticMetadata({}), []))

        expect(Array.from(bookshelf.all())).toEqual([])
    })

    test('It should create book from book note', async () => {
        await bookshelf.process(
            new FakeNote(
                'Books/The Shining.md',
                new StaticMetadata({
                    cover: 'the-shining.jpg',
                    author: ['Stephen King'],
                    published: '1977-01-28',
                    pages: 497,
                    tags: ['novel', 'horror'],
                    lists: ['Horror Classics', 'Favorites'],
                    links: ['https://books.test/the-shining'],
                }),
                [],
            ),
        )

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(bookMetadata(result[0])).toEqual({
            title: 'The Shining',
            cover: 'the-shining.jpg',
            authors: ['Stephen King'],
            published: new Date(1977, 0, 28),
            pages: 497,
            tags: ['novel', 'horror'],
            lists: ['Horror Classics', 'Favorites'],
            links: [Link.from('https://books.test/the-shining')],
        })
    })

    test('It should update book from book note', async () => {
        const note = new FakeNote(
            'Books/The Shining.md',
            new StaticMetadata({
                cover: 'no-cover.jpg',
                author: ['Steve Kong'],
                published: '1999-12-25',
                pages: 2,
                tags: ['comedy'],
                lists: ['Comfort Books'],
                links: ['https://books.test/the-shoning'],
            }),
            [],
        )
        await bookshelf.process(note)

        note.metadata = new StaticMetadata({
            cover: 'the-shining.jpg',
            author: ['Stephen King'],
            published: '1977-01-28',
            pages: 497,
            tags: ['novel', 'horror'],
            lists: ['Horror Classics', 'Favorites'],
            links: ['https://books.test/the-shining'],
        })
        await bookshelf.process(note)

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(bookMetadata(result[0])).toEqual({
            title: 'The Shining',
            cover: 'the-shining.jpg',
            authors: ['Stephen King'],
            published: new Date(1977, 0, 28),
            pages: 497,
            tags: ['novel', 'horror'],
            lists: ['Horror Classics', 'Favorites'],
            links: [Link.from('https://books.test/the-shining')],
        })
    })

    test("Updating a book must not change it's identity", async () => {
        const note = new FakeNote('Books/The Shining.md', new StaticMetadata({ author: ['Steve Kong'] }), [])
        await bookshelf.process(note)
        const book = bookshelf.book(note)

        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({ author: ['Stephen King'] }), []),
        )

        expect(bookshelf.book(note)).toBe(book)
    })

    test('It should create reading journey from book note (pages)', async () => {
        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({}), [
                '2025-01-01: Started reading',
                '2025-01-01: 10-150',
                '2025-01-02: 250',
                '2025-01-03: 447',
                '2025-01-03: Finished reading',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-150',
            '2025-01-02: The Shining: 151-250',
            '2025-01-03: The Shining: 251-447',
            '2025-01-03: The Shining: finished',
        ])
    })

    test('It should create reading journey from book note (percentages)', async () => {
        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({}), [
                '2025-01-01: Started reading',
                '2025-01-01: 20%',
                '2025-01-02: 60%',
                '2025-01-03: 100%',
                '2025-01-03: Finished reading',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 0%-20%',
            '2025-01-02: The Shining: 21%-60%',
            '2025-01-03: The Shining: 61%-100%',
            '2025-01-03: The Shining: finished',
        ])
    })

    test('It should create reading journey from book note (front matter to main)', async () => {
        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({}), [
                '2025-01-01: Started reading',
                '2025-01-01: xii-xv',
                '2025-01-02: xxiii',
                '2025-01-03: 120',
                '2025-01-03: Finished reading',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: xii-xv',
            '2025-01-02: The Shining: xvi-xxiii',
            '2025-01-03: The Shining: 1-120',
            '2025-01-03: The Shining: finished',
        ])
    })

    test('It should update reading journey from book note', async () => {
        const note = new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: Started reading'])
        await bookshelf.process(note)

        note.list = [
            '2025-01-01: Started reading',
            '2025-01-01: 10-150',
            '2025-01-02: 250',
            '2025-01-03: 447',
            '2025-01-03: Finished reading',
        ]
        await bookshelf.process(note)

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-150',
            '2025-01-02: The Shining: 151-250',
            '2025-01-03: The Shining: 251-447',
            '2025-01-03: The Shining: finished',
        ])
    })

    test('It should ignore reading journey in book notes if book note patterns are disabled', async () => {
        bookshelf = BookshelfFactory.fromConfiguration({
            ...defaultConfiguration,
            settings: {
                ...defaultConfiguration.settings,
                bookNote: {
                    ...defaultConfiguration.settings.bookNote,
                    enabled: false,
                },
            },
        })

        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: Started reading']),
        )

        const books = Array.from(bookshelf.all())
        expect(books).toHaveLength(1)
        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([])
    })

    test('It should create book note for book referenced in daily note if it does not exist yet', async () => {
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(result[0].metadata.title).toEqual('The Shining')
    })

    test('It should link reading journey entry from daily note to existing book', async () => {
        const note = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        notes.add(note)
        await bookshelf.process(note)

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        const result = Array.from(bookshelf.all())
        expect(result.map((b) => b.metadata.title)).toEqual(['The Shining'])
    })

    test('It should ignore reading journey entry referencing non-existing notes', async () => {
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [`Started reading [[${nonExistingNote}]]`]),
        )

        const result = Array.from(bookshelf.all())
        expect(result.map((b) => b.metadata.title)).toEqual([])
    })

    test('It should create reading journey from daily note (pages)', async () => {
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Read [[The Shining]]: 10-100',
                'Read [[The Shining]]: 101-447',
                'Finished reading [[The Shining]]',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-100',
            '2025-01-01: The Shining: 101-447',
            '2025-01-01: The Shining: finished',
        ])
    })

    test('It should create reading journey from daily note (percentages)', async () => {
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Read [[The Shining]]: 30%',
                'Read [[The Shining]]: 31%-100%',
                'Finished reading [[The Shining]]',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 0%-30%',
            '2025-01-01: The Shining: 31%-100%',
            '2025-01-01: The Shining: finished',
        ])
    })

    test('It should create reading journey from daily note (front matter to main)', async () => {
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Read [[The Shining]]: xii-xv',
                'Read [[The Shining]]: xxiii',
                'Read [[The Shining]]: 120',
                'Finished reading [[The Shining]]',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: xii-xv',
            '2025-01-01: The Shining: xvi-xxiii',
            '2025-01-01: The Shining: 1-120',
            '2025-01-01: The Shining: finished',
        ])
    })

    test('It should update reading journey from daily note', async () => {
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))
        const note = new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]'])
        await bookshelf.process(note)
        note.list = [
            'Started reading [[The Shining]]',
            'Read [[The Shining]]: 10-447',
            'Finished reading [[The Shining]]',
        ]
        await bookshelf.process(note)

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-447',
            '2025-01-01: The Shining: finished',
        ])
    })

    test('It should ignore daily notes if daily note plugin is disabled', async () => {
        bookshelf = BookshelfFactory.fromConfiguration({
            ...defaultConfiguration,
            dailyNotesSettings: {
                ...defaultConfiguration.dailyNotesSettings,
                enabled: false,
            },
        })
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        const books = Array.from(bookshelf.all())
        expect(books).toHaveLength(0)
        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([])
    })

    test('It should ignore daily notes if daily note patterns are disabled', async () => {
        bookshelf = BookshelfFactory.fromConfiguration({
            ...defaultConfiguration,
            settings: {
                ...defaultConfiguration.settings,
                dailyNote: {
                    ...defaultConfiguration.settings.dailyNote,
                    enabled: false,
                },
            },
        })
        notes.add(new FakeNote('The Shining', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        const books = Array.from(bookshelf.all())
        expect(books).toHaveLength(0)
        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([])
    })

    test.each([['2000-50-99.md'], ['aaaa-bb-cc.md'], ['01/01/2025.md'], ['01.01.2025.md']])(
        "It should ignore notes if they don't match the daily note file format (example: %s)",
        async (path) => {
            await bookshelf.process(new FakeNote(path, new StaticMetadata({}), ['Started reading The Shining']))

            expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([])
        },
    )

    test('Removing a note should remove the corresponding book', async () => {
        const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        const animalFarm = new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), [])
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(shining)
        await bookshelf.process(animalFarm)
        await bookshelf.process(dracula)

        bookshelf.remove(animalFarm)

        expect(Array.from(bookshelf.all()).map((b) => b.metadata.title)).toEqual(['The Shining', 'Dracula'])
    })

    test('Removing a note should remove corresponding reading journey items', async () => {
        const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        const animalFarm = new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), [])
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        notes.add(shining)
        notes.add(animalFarm)
        notes.add(dracula)
        await bookshelf.process(shining)
        await bookshelf.process(animalFarm)
        await bookshelf.process(dracula)
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Started reading [[Animal Farm]]',
                'Started reading [[Dracula]]',
            ]),
        )

        bookshelf.remove(animalFarm)

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: Dracula: started',
        ])
    })

    test('Moving a book note to a different folder should remove the corresponding book', async () => {
        const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        const animalFarm = new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), [])
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(shining)
        await bookshelf.process(animalFarm)
        await bookshelf.process(dracula)

        animalFarm.path = 'Notes/Animal Farm.md'
        await bookshelf.process(animalFarm)

        expect(Array.from(bookshelf.all()).map((b) => b.metadata.title)).toEqual(['The Shining', 'Dracula'])
    })

    test('After moving a book note to a different folder and back to the book folder, it should be a book again', async () => {
        const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        const animalFarm = new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), [])
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(shining)
        await bookshelf.process(animalFarm)
        await bookshelf.process(dracula)

        animalFarm.path = 'Notes/Animal Farm.md'
        await bookshelf.process(animalFarm)
        animalFarm.path = 'Books/Animal Farm.md'
        await bookshelf.process(animalFarm)

        expect(Array.from(bookshelf.all()).map((b) => b.metadata.title)).toEqual([
            'The Shining',
            'Dracula',
            'Animal Farm',
        ])
    })

    test('Moving a book note to a different folder should remove the related reading process', async () => {
        const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [])
        const animalFarm = new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), [])
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        notes.add(shining)
        notes.add(animalFarm)
        notes.add(dracula)
        await bookshelf.process(shining)
        await bookshelf.process(animalFarm)
        await bookshelf.process(dracula)
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Started reading [[Animal Farm]]',
                'Started reading [[Dracula]]',
            ]),
        )

        animalFarm.path = 'Notes/Animal Farm.md'
        await bookshelf.process(animalFarm)

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: Dracula: started',
        ])
    })
})

test('It should return all books added to the bookshelf', async () => {
    await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), []))
    await bookshelf.process(new FakeNote('Books/Animal Farm.md', new StaticMetadata({}), []))
    await bookshelf.process(new FakeNote('Books/Dracula.md', new StaticMetadata({}), []))

    const result = bookshelf.all()

    expect(Array.from(result).map((b) => b.metadata.title)).toEqual(['The Shining', 'Animal Farm', 'Dracula'])
})

describe('Non-existing book', () => {
    test('cannot be retrieved', () => {
        expect(() => bookshelf.book(new FakeNote('the-shining', new StaticMetadata({}), []))).toThrow(
            'There is no book for note "the-shining"',
        )
    })
})

test('reading journey should by reflected in book', async () => {
    const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-02-03: 1-10', '2025-02-05: 20'])
    const shining = new FakeNote('Books/The Shining.md', new StaticMetadata({}), [
        '2025-02-01: 10-20',
        '2025-02-04: 50',
    ])
    await bookshelf.process(dracula)
    await bookshelf.process(shining)

    expect(bookshelf.book(dracula).readingJourney.map(readingProgressAsString)).toEqual([
        '2025-02-03: Dracula: 1-10',
        '2025-02-05: Dracula: 11-20',
    ])
    expect(bookshelf.book(shining).readingJourney.map(readingProgressAsString)).toEqual([
        '2025-02-01: The Shining: 10-20',
        '2025-02-04: The Shining: 21-50',
    ])
})

describe('Statistics', () => {
    describe('Years', () => {
        test('should be empty if there is no activity', () => {
            expect(bookshelf.statistics().years()).toEqual([])
        })

        test('should include only years with activities', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                    '2024-01-01: Started reading',
                    '2025-12-31: 10-150',
                    '2027-07-15: Finished reading',
                ]),
            )

            expect(bookshelf.statistics().years()).toEqual([2024, 2025, 2027])
        })
    })

    describe('Actions', () => {
        beforeEach(async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                    '2024-12-30: Started reading',
                    '2024-12-31: Finished reading',
                    '2025-01-04: Started reading',
                    '2025-01-05: Abandoned book',
                ]),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), [
                    '2025-01-02: Started reading',
                    '2025-01-03: Finished reading',
                ]),
            )
        })

        test('Total', () => {
            const result = bookshelf.statistics().actions()

            expect(result).toEqual({ started: 3, finished: 2, abandoned: 1 })
        })

        test('Filtered by year', () => {
            expect(bookshelf.statistics(2024).actions()).toEqual({ started: 1, finished: 1, abandoned: 0 })
            expect(bookshelf.statistics(2025).actions()).toEqual({ started: 2, finished: 1, abandoned: 1 })
            expect(bookshelf.statistics(2026).actions()).toEqual({ started: 0, finished: 0, abandoned: 0 })
        })
    })

    describe('Pages Read', () => {
        test('should be empty if there is no reading progress', () => {
            expect(pagesReadAsObject(bookshelf.statistics().pagesRead(Interval.Day))).toEqual({})
        })

        test('should be limited if given a year', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2024-12-31: 1', '2026-01-01: 30']),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: 10', '2025-12-31: 20']),
            )

            const result2024 = bookshelf.statistics(2024).pagesRead(Interval.Year)
            const result2025 = bookshelf.statistics(2025).pagesRead(Interval.Year)
            const result2026 = bookshelf.statistics(2026).pagesRead(Interval.Year)

            expect(pagesReadAsObject(result2024)).toEqual({ '2024-01-01': 1 })
            expect(pagesReadAsObject(result2025)).toEqual({ '2025-01-01': 20 })
            expect(pagesReadAsObject(result2026)).toEqual({ '2026-01-01': 29 })
        })

        test('can be grouped by day', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                    '2024-12-31: 10',
                    '2025-01-02: 20',
                    '2025-01-05: 30',
                    '2025-01-07: 60',
                ]),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-02: 50', '2025-01-03: 100']),
            )

            const result = bookshelf.statistics().pagesRead(Interval.Day)

            expect(pagesReadAsObject(result)).toEqual({
                '2024-12-31': 10,
                '2025-01-01': 0,
                '2025-01-02': 60,
                '2025-01-03': 50,
                '2025-01-04': 0,
                '2025-01-05': 10,
                '2025-01-06': 0,
                '2025-01-07': 30,
            })
        })

        test('can be grouped by week', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                    '2024-12-31: 10',
                    '2025-01-09: 20',
                    '2025-01-21: 30',
                    '2025-02-01: 60',
                ]),
            )
            await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-21: 100']))

            const result = bookshelf.statistics().pagesRead(Interval.Week)

            expect(pagesReadAsObject(result)).toEqual({
                '2024-12-30': 10,
                '2025-01-06': 10,
                '2025-01-13': 0,
                '2025-01-20': 110,
                '2025-01-27': 30,
            })
        })

        test('can be grouped by month', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                    '2024-12-31: 10',
                    '2025-01-31: 20',
                    '2025-02-15: 30',
                    '2025-04-02: 60',
                ]),
            )
            await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-02-15: 100']))

            const result = bookshelf.statistics().pagesRead(Interval.Month)

            expect(pagesReadAsObject(result)).toEqual({
                '2024-12-01': 10,
                '2025-01-01': 10,
                '2025-02-01': 110,
                '2025-03-01': 0,
                '2025-04-01': 30,
            })
        })

        test('can be grouped by year', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2023-01-01: 10', '2025-03-02: 50']),
            )
            await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-02-15: 100']))

            const result = bookshelf.statistics().pagesRead(Interval.Year)

            expect(pagesReadAsObject(result)).toEqual({
                '2023-01-01': 10,
                '2024-01-01': 0,
                '2025-01-01': 140,
            })
        })

        function pagesReadAsObject(input: Map<Date, number>): { [key: string]: number } {
            const result: { [key: string]: number } = {}

            for (const [date, count] of input.entries()) {
                result[DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')] = count
            }

            return result
        }
    })

    describe('Total number of pages', () => {
        test('should be 0 if there is no reading progress', () => {
            expect(bookshelf.statistics().totalNumberOfPages()).toEqual(0)
        })

        test('should be limited if given a year', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2024-12-31: 1', '2026-01-01: 30']),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: 10', '2025-12-31: 20']),
            )

            expect(bookshelf.statistics(2024).totalNumberOfPages()).toEqual(1)
            expect(bookshelf.statistics(2025).totalNumberOfPages()).toEqual(20)
            expect(bookshelf.statistics(2026).totalNumberOfPages()).toEqual(29)
        })
    })

    describe('Books', () => {
        test('should be empty if there is no reading progress', () => {
            expect(bookshelf.statistics().books()).toEqual([])
        })

        test('should return a unique list of books', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2024-12-31: 1', '2026-01-01: 30']),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: 10', '2025-12-31: 20']),
            )

            expect(
                bookshelf
                    .statistics()
                    .books()
                    .map((b) => b.metadata.title),
            ).toEqual(['Dracula', 'The Shining'])
        })

        test('should be limited if given a year', async () => {
            await bookshelf.process(
                new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2024-12-31: 1', '2025-01-01: 30']),
            )
            await bookshelf.process(
                new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-02: 10', '2026-01-01: 20']),
            )

            expect(
                bookshelf
                    .statistics(2024)
                    .books()
                    .map((b) => b.metadata.title),
            ).toEqual(['Dracula'])
            expect(
                bookshelf
                    .statistics(2025)
                    .books()
                    .map((b) => b.metadata.title),
            ).toEqual(['Dracula', 'The Shining'])
            expect(
                bookshelf
                    .statistics(2026)
                    .books()
                    .map((b) => b.metadata.title),
            ).toEqual(['The Shining'])
        })
    })
})

describe('Reading status', () => {
    test('book without reading journey should have status "unread"', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('unread')
    })

    test('book should have status "reading" if action is "start"', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Started reading'])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('reading')
    })

    test('book should have status "reading" if action is "progress"', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: 5-115'])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('reading')
    })

    test('book should have status "finished" if action is "finish"', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Finished reading'])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('finished')
    })

    test('book should have status "abandoned" if action is "abandon"', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Abandoned book'])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('abandoned')
    })

    test('last action counts', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
            '2025-01-02: Started reading',
            '2025-01-02: 1-20',
            '2025-01-03: Abandoned book',
            '2025-01-05: Started reading',
            '2025-01-05: 21-120',
            '2025-01-06: Finished reading',
        ])
        await bookshelf.process(dracula)

        const book = bookshelf.book(dracula)

        expect(book.status).toBe('finished')
    })
})

describe('Adding items to reading journey', () => {
    test('Items should show up in book note and reading journey', async () => {
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Started reading'])
        notes.add(dracula)
        await bookshelf.process(dracula)

        await bookshelf.addToReadingJourney({
            action: 'progress',
            bookNote: dracula,
            date: new Date(2025, 0, 3),
            start: position(1),
            end: position(50),
        })
        await bookshelf.addToReadingJourney({
            action: 'abandoned',
            bookNote: dracula,
            date: new Date(2025, 0, 4),
        })
        await bookshelf.addToReadingJourney({
            action: 'started',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
        })
        await bookshelf.addToReadingJourney({
            action: 'progress',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
            start: null,
            end: position(350),
        })
        await bookshelf.addToReadingJourney({
            action: 'finished',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
        })

        expect(await dracula.listItems()).toEqual([
            '2025-01-02: Started reading',
            '2025-01-03: 1-50',
            '2025-01-04: Abandoned book',
            '2025-01-05: Started reading',
            '2025-01-05: 350',
            '2025-01-05: Finished reading',
        ])
        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-02: Dracula: started',
            '2025-01-03: Dracula: 1-50',
            '2025-01-04: Dracula: abandoned',
            '2025-01-05: Dracula: started',
            '2025-01-05: Dracula: 51-350',
            '2025-01-05: Dracula: finished',
        ])
    })

    test('Items should show up in daily notes and reading journey', async () => {
        bookshelf = BookshelfFactory.fromConfiguration({
            ...defaultConfiguration,
            settings: {
                ...defaultConfiguration.settings,
                readingProgress: {
                    ...defaultConfiguration.settings.readingProgress,
                    newEntryLocation: 'dailyNote',
                },
            },
        })
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Started reading'])
        notes.add(dracula)
        await bookshelf.process(dracula)

        await bookshelf.addToReadingJourney({
            action: 'progress',
            bookNote: dracula,
            date: new Date(2025, 0, 3),
            start: position(1),
            end: position(50),
        })
        await bookshelf.addToReadingJourney({
            action: 'abandoned',
            bookNote: dracula,
            date: new Date(2025, 0, 4),
        })
        await bookshelf.addToReadingJourney({
            action: 'started',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
        })
        await bookshelf.addToReadingJourney({
            action: 'progress',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
            start: null,
            end: position(350),
        })
        await bookshelf.addToReadingJourney({
            action: 'finished',
            bookNote: dracula,
            date: new Date(2025, 0, 5),
        })

        expect(await (await notes.dailyNote(new Date(2025, 0, 3))).listItems('Reading')).toEqual([
            'Read [[Dracula]]: 1-50',
        ])
        expect(await (await notes.dailyNote(new Date(2025, 0, 4))).listItems('Reading')).toEqual([
            'Abandoned [[Dracula]]',
        ])
        expect(await (await notes.dailyNote(new Date(2025, 0, 5))).listItems('Reading')).toEqual([
            'Started reading [[Dracula]]',
            'Read [[Dracula]]: 350',
            'Finished reading [[Dracula]]',
        ])
        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-02: Dracula: started',
            '2025-01-03: Dracula: 1-50',
            '2025-01-04: Dracula: abandoned',
            '2025-01-05: Dracula: started',
            '2025-01-05: Dracula: 51-350',
            '2025-01-05: Dracula: finished',
        ])
    })
})

describe('Subscribers', () => {
    test('Notify subscribers when new book was added', async () => {
        const subscriber1 = vi.fn()
        const subscriber2 = vi.fn()
        bookshelf.subscribe(subscriber1)
        bookshelf.subscribe(subscriber2)

        await bookshelf.process(new FakeNote('Books/Dracula.md', new StaticMetadata({}), []))

        expect(subscriber1).toHaveBeenCalledOnce()
        expect(subscriber2).toHaveBeenCalledOnce()
    })

    test('Notify subscribers when book was removed', async () => {
        const subscriber1 = vi.fn()
        const subscriber2 = vi.fn()
        bookshelf.subscribe(subscriber1)
        bookshelf.subscribe(subscriber2)
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(dracula)
        subscriber1.mockReset()
        subscriber2.mockReset()

        bookshelf.remove(dracula)

        expect(subscriber1).toHaveBeenCalledOnce()
        expect(subscriber2).toHaveBeenCalledOnce()
    })

    test('Notify subscribers when reading progress was updated from note', async () => {
        const subscriber1 = vi.fn()
        const subscriber2 = vi.fn()
        bookshelf.subscribe(subscriber1)
        bookshelf.subscribe(subscriber2)
        const shining = new FakeNote('Books/The Shining', new StaticMetadata({}), [])
        notes.add(shining)
        await bookshelf.process(shining)
        subscriber1.mockReset()
        subscriber2.mockReset()

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        expect(subscriber1).toHaveBeenCalledOnce()
        expect(subscriber2).toHaveBeenCalledOnce()
    })

    test('Notify subscribers when item was added to reading journey', async () => {
        const subscriber1 = vi.fn()
        const subscriber2 = vi.fn()
        bookshelf.subscribe(subscriber1)
        bookshelf.subscribe(subscriber2)
        const dracula = new FakeNote('Books/Dracula.md', new StaticMetadata({}), [])
        await bookshelf.process(dracula)
        subscriber1.mockReset()
        subscriber2.mockReset()

        await bookshelf.addToReadingJourney({ action: 'started', bookNote: dracula, date: new Date(2025, 3, 10) })

        expect(subscriber1).toHaveBeenCalledOnce()
        expect(subscriber2).toHaveBeenCalledOnce()
    })

    test('Subscriber must not be notified anymore after unsubscribing', async () => {
        const subscriber1 = vi.fn()
        const subscriber2 = vi.fn()
        const subscriber3 = vi.fn()
        bookshelf.subscribe(subscriber1)
        const unsubscribe2 = bookshelf.subscribe(subscriber2)
        bookshelf.subscribe(subscriber3)

        unsubscribe2()
        await bookshelf.process(new FakeNote('Books/Dracula.md', new StaticMetadata({}), []))

        expect(subscriber1).toHaveBeenCalledOnce()
        expect(subscriber2).not.toHaveBeenCalled()
        expect(subscriber3).toHaveBeenCalledOnce()
    })
})

function bookMetadata(book: Book): BookMetadata {
    return {
        title: book.metadata.title,
        cover: book.metadata.cover,
        authors: book.metadata.authors,
        published: book.metadata.published,
        pages: book.metadata.pages,
        tags: book.metadata.tags,
        lists: book.metadata.lists,
        links: book.metadata.links,
    }
}

function readingProgressAsString(value: ReadingJourneyItem): string {
    if (value.action !== 'progress') {
        return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.action}`
    }

    return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.start}-${value.end}`
}
