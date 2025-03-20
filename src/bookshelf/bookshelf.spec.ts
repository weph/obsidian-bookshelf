import { beforeEach, describe, expect, test } from '@jest/globals'
import { Bookshelf } from './bookshelf'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyItem } from './reading-journey/reading-journey-log'
import { Interval } from './reading-journey/statistics/statistics'
import { DateTime } from 'luxon'
import { FakeNote } from '../support/fake-note'
import { StaticMetadata } from './metadata/metadata'
import { BookMetadataFactory } from './metadata/book-metadata-factory'
import { bookNotePatterns } from './reading-journey/pattern/book-note/book-note-pattern'
import { dailyNotePatterns } from './reading-journey/pattern/daily-note/daily-note-pattern'

let bookshelf: Bookshelf

const nonExistingNote = 'Non-existing Note'

beforeEach(() => {
    bookshelf = new Bookshelf(
        'Books',
        {
            heading: 'Reading Journey',
            format: 'YYYY-MM-DD',
            folder: '',
        },
        {
            heading: 'Reading',
        },
        new BookMetadataFactory(
            {
                cover: 'cover',
                author: 'author',
                published: 'published',
                tags: 'tags',
                rating: 'rating',
            },
            (link) => link,
        ),
        bookNotePatterns(
            {
                started: '{date}: Started reading',
                abandoned: '{date}: Abandoned book',
                finished: '{date}: Finished reading',
                absoluteProgress: '{date}: {startPage}-{endPage}',
                relativeProgress: '{date}: {endPage}',
            },
            'yyyy-MM-dd',
        ).patterns,
        dailyNotePatterns({
            started: 'Started reading {book}',
            abandoned: 'Abandoned {book}',
            finished: 'Finished reading {book}',
            absoluteProgress: 'Read {book}: {startPage}-{endPage}',
            relativeProgress: 'Read {book}: {endPage}',
        }).patterns,
        (input) => {
            const identifier = input.replace('[[', '').replace(']]', '')

            return identifier === nonExistingNote ? null : `Books/${identifier}.md`
        },
    )
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
                    tags: ['novel', 'horror'],
                }),
                [],
            ),
        )

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(result[0].metadata).toEqual({
            title: 'The Shining',
            cover: 'the-shining.jpg',
            authors: ['Stephen King'],
            published: new Date(1977, 0, 28),
            tags: ['novel', 'horror'],
        })
    })

    test('It should update book from book note', async () => {
        await bookshelf.process(
            new FakeNote(
                'Books/The Shining.md',
                new StaticMetadata({
                    cover: 'no-cover.jpg',
                    author: ['Steve Kong'],
                    published: '1999-12-25',
                    tags: ['comedy'],
                }),
                [],
            ),
        )

        await bookshelf.process(
            new FakeNote(
                'Books/The Shining.md',
                new StaticMetadata({
                    cover: 'the-shining.jpg',
                    author: ['Stephen King'],
                    published: '1977-01-28',
                    tags: ['novel', 'horror'],
                }),
                [],
            ),
        )

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(result[0].metadata).toEqual({
            title: 'The Shining',
            cover: 'the-shining.jpg',
            authors: ['Stephen King'],
            published: new Date(1977, 0, 28),
            tags: ['novel', 'horror'],
        })
    })

    test("Updating a book must not change it's identity", async () => {
        const note = new FakeNote('Books/The Shining.md', new StaticMetadata({ author: ['Steve Kong'] }), [])
        await bookshelf.process(note)
        const book = bookshelf.book(note.identifier)

        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({ author: ['Stephen King'] }), []),
        )

        expect(bookshelf.book(note.identifier)).toBe(book)
    })

    test('It should create reading journey from book note', async () => {
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

    test('It should update reading journey from book note', async () => {
        await bookshelf.process(
            new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-01-01: Started reading']),
        )

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

    test('It should create book note for book referenced in daily note if it does not exist yet', async () => {
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(result[0].metadata).toEqual({ title: 'Books/The Shining.md' })
    })

    test('It should link reading journey entry from daily note to existing book', async () => {
        await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), []))

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

    test('It should create reading journey from daily note note', async () => {
        await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), []))

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

    test('It should update reading journey from daily note note', async () => {
        await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), []))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading [[The Shining]]']),
        )

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading [[The Shining]]',
                'Read [[The Shining]]: 10-447',
                'Finished reading [[The Shining]]',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-447',
            '2025-01-01: The Shining: finished',
        ])
    })

    test.each([['2000-50-99.md'], ['aaaa-bb-cc.md'], ['01/01/2025.md'], ['01.01.2025.md']])(
        "It should ignore notes if they don't match the daily note file format (example: %s)",
        async (path) => {
            await bookshelf.process(new FakeNote(path, new StaticMetadata({}), ['Started reading The Shining']))

            expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([])
        },
    )
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
        expect(() => bookshelf.book('the-shining')).toThrow(BookshelfError.identifierDoesntExist('the-shining'))
    })
})

test('reading journey should by reflected in book', async () => {
    await bookshelf.process(
        new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-02-03: 1-10', '2025-02-05: 20']),
    )
    await bookshelf.process(
        new FakeNote('Books/The Shining.md', new StaticMetadata({}), ['2025-02-01: 10-20', '2025-02-04: 50']),
    )

    expect(bookshelf.book('Books/Dracula.md').readingJourney.map(readingProgressAsString)).toEqual([
        '2025-02-03: Dracula: 1-10',
        '2025-02-05: Dracula: 11-20',
    ])
    expect(bookshelf.book('Books/The Shining.md').readingJourney.map(readingProgressAsString)).toEqual([
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
        await bookshelf.process(new FakeNote('Books/Dracula.md', new StaticMetadata({}), []))

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('unread')
    })

    test('book should have status "reading" if action is "start"', async () => {
        await bookshelf.process(
            new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Started reading']),
        )

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('reading')
    })

    test('book should have status "reading" if action is "progress"', async () => {
        await bookshelf.process(new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: 5-115']))

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('reading')
    })

    test('book should have status "finished" if action is "finish"', async () => {
        await bookshelf.process(
            new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Finished reading']),
        )

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('finished')
    })

    test('book should have status "abandoned" if action is "abandon"', async () => {
        await bookshelf.process(
            new FakeNote('Books/Dracula.md', new StaticMetadata({}), ['2025-01-02: Abandoned book']),
        )

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('abandoned')
    })

    test('last action counts', async () => {
        await bookshelf.process(
            new FakeNote('Books/Dracula.md', new StaticMetadata({}), [
                '2025-01-02: Started reading',
                '2025-01-02: 1-20',
                '2025-01-03: Abandoned book',
                '2025-01-05: Started reading',
                '2025-01-05: 21-120',
                '2025-01-06: Finished reading',
            ]),
        )

        const book = bookshelf.book('Books/Dracula.md')

        expect(book.status).toBe('finished')
    })
})

function readingProgressAsString(value: ReadingJourneyItem): string {
    if (value.action !== 'progress') {
        return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.action}`
    }

    return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.startPage}-${value.endPage}`
}
