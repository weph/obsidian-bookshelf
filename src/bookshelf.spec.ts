import { beforeEach, describe, expect, test } from '@jest/globals'
import { Bookshelf } from './bookshelf'
import { BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyItem } from './reading-journey/reading-journey-log'
import { Interval } from './statistics'
import { DateTime } from 'luxon'
import { FakeNote } from './support/fake-note'
import { StaticMetadata } from './metadata/metadata'
import { BookMetadataFactory } from './book-metadata-factory'
import { PatternCollection } from './reading-journey/pattern/pattern-collection'
import { BookNoteActionPattern } from './reading-journey/pattern/book-note/book-note-action-pattern'
import { BookNoteProgressPattern } from './reading-journey/pattern/book-note/book-note-progress-pattern'
import { DailyNoteActionPattern } from './reading-journey/pattern/daily-note/daily-note-action-pattern'
import { DailyNoteProgressPattern } from './reading-journey/pattern/daily-note/daily-note-progress-pattern'

let bookshelf: Bookshelf

beforeEach(() => {
    bookshelf = new Bookshelf(
        'Books',
        new BookMetadataFactory(
            {
                cover: 'cover',
                author: 'author',
                published: 'published',
                tags: 'tags',
            },
            (link) => link,
        ),
        new PatternCollection([
            new BookNoteActionPattern('{date}: Started reading', 'started', 'yyyy-MM-dd'),
            new BookNoteActionPattern('{date}: Abandoned book', 'abandoned', 'yyyy-MM-dd'),
            new BookNoteActionPattern('{date}: Finished reading', 'finished', 'yyyy-MM-dd'),
            new BookNoteProgressPattern('{date}: {startPage}-{endPage}', 'yyyy-MM-dd'),
            new BookNoteProgressPattern('{date}: {endPage}', 'yyyy-MM-dd'),
        ]),
        new PatternCollection([
            new DailyNoteActionPattern('Started reading {book}', 'started'),
            new DailyNoteActionPattern('Abandoned {book}', 'abandoned'),
            new DailyNoteActionPattern('Finished reading {book}', 'finished'),
            new DailyNoteProgressPattern('Read {book}: {startPage}-{endPage}'),
            new DailyNoteProgressPattern('Read {book}: {endPage}'),
        ]),
        (identifier) => identifier,
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
        await bookshelf.process(new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading The Shining']))

        const result = Array.from(bookshelf.all())
        expect(result).toHaveLength(1)
        expect(result[0].metadata).toEqual({ title: 'The Shining' })
    })

    // todo: maybe it's better to allow only WikiLinks and not do all this "if
    // it's just text, let's try to figure out what note this belongs or create
    // a new book note if nothing can be found"
    test.skip('It should link reading journey entry from daily note to existing book', async () => {
        await bookshelf.process(new FakeNote('Books/The Shining.md', new StaticMetadata({}), []))

        await bookshelf.process(new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading The Shining']))

        const result = Array.from(bookshelf.all())
        expect(result.map((b) => b.metadata.title)).toEqual(['The Shining'])
    })

    test('It should create reading journey from daily note note', async () => {
        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading The Shining',
                'Read The Shining: 10-100',
                'Read The Shining: 101-447',
                'Finished reading The Shining',
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
        await bookshelf.process(new FakeNote('2025-01-01.md', new StaticMetadata({}), ['Started reading The Shining']))

        await bookshelf.process(
            new FakeNote('2025-01-01.md', new StaticMetadata({}), [
                'Started reading The Shining',
                'Read The Shining: 10-447',
                'Finished reading The Shining',
            ]),
        )

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-01-01: The Shining: started',
            '2025-01-01: The Shining: 10-447',
            '2025-01-01: The Shining: finished',
        ])
    })
})

test('It should return all books added to the bookshelf', () => {
    const shining = book('The Shining')
    const animalFarm = book('Animal Farm')
    const dracula = book('Dracula')
    bookshelf.add('shining', shining)
    bookshelf.add('animal-farm', animalFarm)
    bookshelf.add('dracula', dracula)

    const result = bookshelf.all()

    expect(Array.from(result).map((b) => b.metadata)).toEqual([shining, animalFarm, dracula])
})

describe('Non-existing book', () => {
    test('cannot be retrieved', () => {
        expect(() => bookshelf.book('the-shining')).toThrow(BookshelfError.identifierDoesntExist('the-shining'))
    })
})

describe('After adding a book', () => {
    const shining = book('The Shining')

    beforeEach(() => {
        bookshelf.add('the-shining', shining)
    })

    test('it can be retrieved', () => {
        expect(bookshelf.book('the-shining').metadata).toBe(shining)
    })

    test('it can not be added again', () => {
        expect(() => bookshelf.add('the-shining', shining)).toThrow(BookshelfError.identifierExists('the-shining'))
    })

    test('no other book can be added using the same identifier', () => {
        const other = book('Another Book')

        expect(() => bookshelf.add('the-shining', other)).toThrow(BookshelfError.identifierExists('the-shining'))
    })
})

test('reading journey should by reflected in book', () => {
    const dracula = 'dracula'
    const shining = 'shining'
    bookshelf.add(dracula, book('Dracula'))
    bookshelf.add(shining, book('The Shining'))
    bookshelf.addReadingProgress(date(2025, 2, 3), dracula, 10, 1, '')
    bookshelf.addReadingProgress(date(2025, 2, 4), shining, 50, null, '')
    bookshelf.addReadingProgress(date(2025, 2, 5), dracula, 20, null, '')
    bookshelf.addReadingProgress(date(2025, 2, 1), shining, 20, 10, '')

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

function readingProgressAsString(value: ReadingJourneyItem): string {
    if (value.action !== 'progress') {
        return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.action}`
    }

    return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.startPage}-${value.endPage}`
}

function date(year: number, month: number, day: number): Date {
    return new Date(year, month - 1, day, 0, 0, 0, 0)
}

function book(title: string): BookMetadata {
    return { title }
}
