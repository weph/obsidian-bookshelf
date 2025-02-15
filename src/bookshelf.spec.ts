import { beforeEach, describe, expect, test } from '@jest/globals'
import { Bookshelf } from './bookshelf'
import { BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingJourneyItem } from './reading-journey/reading-journey'
import { Interval } from './statistics'
import { DateTime } from 'luxon'

let bookshelf: Bookshelf

beforeEach(() => {
    bookshelf = new Bookshelf()
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
    test('does not exist', () => {
        expect(bookshelf.has('unknown-book')).toBeFalsy()
    })

    test('cannot be retrieved', () => {
        expect(() => bookshelf.book('the-shining')).toThrow(BookshelfError.identifierDoesntExist('the-shining'))
    })
})

describe('After adding a book', () => {
    const shining = book('The Shining')

    beforeEach(() => {
        bookshelf.add('the-shining', shining)
    })

    test('it does exist', () => {
        expect(bookshelf.has('the-shining')).toBeTruthy()
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

describe('Reading journey', () => {
    const dracula = 'dracula'
    const shining = 'shining'

    beforeEach(() => {
        bookshelf.add(dracula, book('Dracula'))
        bookshelf.add(shining, book('The Shining'))
    })

    test('should be ordered by date', () => {
        bookshelf.addActionToJourney(date(2025, 2, 3), dracula, 'started', '')
        bookshelf.addReadingProgress(date(2025, 2, 3), dracula, 10, 1, '')
        bookshelf.addActionToJourney(date(2025, 2, 4), dracula, 'abandoned', '')
        bookshelf.addActionToJourney(date(2025, 2, 5), dracula, 'started', '')
        bookshelf.addReadingProgress(date(2025, 2, 4), shining, 50, null, '')
        bookshelf.addActionToJourney(date(2025, 2, 4), shining, 'abandoned', '')
        bookshelf.addReadingProgress(date(2025, 2, 5), dracula, 20, null, '')
        bookshelf.addReadingProgress(date(2025, 2, 10), dracula, 100, null, '')
        bookshelf.addActionToJourney(date(2025, 2, 10), dracula, 'finished', '')
        bookshelf.addActionToJourney(date(2025, 2, 1), shining, 'started', '')
        bookshelf.addReadingProgress(date(2025, 2, 1), shining, 20, 10, '')

        const journey = bookshelf.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-02-01: The Shining: started',
            '2025-02-01: The Shining: 10-20',
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10',
            '2025-02-04: Dracula: abandoned',
            '2025-02-04: The Shining: 21-50',
            '2025-02-04: The Shining: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20',
            '2025-02-10: Dracula: 21-100',
            '2025-02-10: Dracula: finished',
        ])
    })

    test('should by reflected in book', () => {
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

    test('items on the same date should be returned in the order of addition', () => {
        bookshelf.addReadingProgress(date(2025, 1, 1), dracula, 1, null, '')
        bookshelf.addReadingProgress(date(2025, 1, 1), shining, 2, null, '')
        bookshelf.addReadingProgress(date(2025, 1, 2), shining, 3, null, '')
        bookshelf.addReadingProgress(date(2025, 1, 2), dracula, 4, null, '')

        const journey = bookshelf.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-1',
            '2025-01-01: The Shining: 1-2',
            '2025-01-02: The Shining: 3-3',
            '2025-01-02: Dracula: 2-4',
        ])
    })

    test('items should be connected properly even if added in arbitrary order', () => {
        bookshelf.addReadingProgress(date(2025, 1, 1), dracula, 10, null, '')
        bookshelf.addReadingProgress(date(2025, 1, 3), dracula, 30, null, '')
        bookshelf.addReadingProgress(date(2025, 1, 2), dracula, 20, null, '')

        const journey = bookshelf.readingJourney()

        expect(journey.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-10',
            '2025-01-02: Dracula: 11-20',
            '2025-01-03: Dracula: 21-30',
        ])
    })

    test('can be removed by source', () => {
        bookshelf.addActionToJourney(date(2025, 2, 3), dracula, 'started', '2025-02-03.md')
        bookshelf.addReadingProgress(date(2025, 2, 3), dracula, 10, 1, '2025-02-03.md')
        bookshelf.addActionToJourney(date(2025, 2, 4), dracula, 'abandoned', '2025-02-04.md')
        bookshelf.addActionToJourney(date(2025, 2, 5), dracula, 'started', '2025-02-05.md')
        bookshelf.addReadingProgress(date(2025, 2, 4), shining, 50, null, 'the-shining.md')
        bookshelf.addActionToJourney(date(2025, 2, 4), shining, 'abandoned', 'the-shining.md')
        bookshelf.addReadingProgress(date(2025, 2, 5), dracula, 20, null, '2025-02-06.md')
        bookshelf.addReadingProgress(date(2025, 2, 10), dracula, 100, null, '2025-02-10.md')
        bookshelf.addActionToJourney(date(2025, 2, 10), dracula, 'finished', '2025-02-10.md')
        bookshelf.addActionToJourney(date(2025, 2, 1), shining, 'started', 'the-shining.md')
        bookshelf.addReadingProgress(date(2025, 2, 1), shining, 20, 10, 'the-shining.md')

        bookshelf.removeFromJourneyBySource('the-shining.md')

        expect(bookshelf.readingJourney().map(readingProgressAsString)).toEqual([
            '2025-02-03: Dracula: started',
            '2025-02-03: Dracula: 1-10',
            '2025-02-04: Dracula: abandoned',
            '2025-02-05: Dracula: started',
            '2025-02-05: Dracula: 11-20',
            '2025-02-10: Dracula: 21-100',
            '2025-02-10: Dracula: finished',
        ])
    })
})

describe('Statistics', () => {
    const dracula = 'dracula'
    const shining = 'shining'

    beforeEach(() => {
        bookshelf.add(dracula, book('Dracula'))
        bookshelf.add(shining, book('The Shining'))
    })

    describe('Years', () => {
        test('should be empty if there is no activity', () => {
            expect(bookshelf.statistics().years()).toEqual([])
        })

        test('should include only years with activities', () => {
            bookshelf.addReadingProgress(date(2024, 1, 1), dracula, 1, null, '')
            bookshelf.addReadingProgress(date(2025, 12, 31), dracula, 1, null, '')
            bookshelf.addReadingProgress(date(2027, 7, 15), dracula, 1, null, '')

            expect(bookshelf.statistics().years()).toEqual([2024, 2025, 2027])
        })
    })

    describe('Actions', () => {
        test('Total', () => {
            bookshelf.addActionToJourney(date(2024, 12, 30), dracula, 'started', '')
            bookshelf.addActionToJourney(date(2024, 12, 31), dracula, 'finished', '')
            bookshelf.addActionToJourney(date(2025, 1, 2), shining, 'started', '')
            bookshelf.addActionToJourney(date(2025, 1, 3), shining, 'finished', '')
            bookshelf.addActionToJourney(date(2025, 1, 4), dracula, 'started', '')
            bookshelf.addActionToJourney(date(2025, 1, 5), dracula, 'abandoned', '')

            const result = bookshelf.statistics().actions()

            expect(result).toEqual({ started: 3, finished: 2, abandoned: 1 })
        })

        test('Filtered by year', () => {
            bookshelf.addActionToJourney(date(2024, 12, 30), dracula, 'started', '')
            bookshelf.addActionToJourney(date(2024, 12, 31), dracula, 'finished', '')
            bookshelf.addActionToJourney(date(2025, 1, 2), shining, 'started', '')
            bookshelf.addActionToJourney(date(2025, 1, 3), shining, 'finished', '')
            bookshelf.addActionToJourney(date(2025, 1, 4), dracula, 'started', '')
            bookshelf.addActionToJourney(date(2025, 1, 5), dracula, 'abandoned', '')

            expect(bookshelf.statistics(2024).actions()).toEqual({ started: 1, finished: 1, abandoned: 0 })
            expect(bookshelf.statistics(2025).actions()).toEqual({ started: 2, finished: 1, abandoned: 1 })
            expect(bookshelf.statistics(2026).actions()).toEqual({ started: 0, finished: 0, abandoned: 0 })
        })
    })

    describe('Pages Read', () => {
        test('should be empty if there is no reading progress', () => {
            expect(pagesReadAsObject(bookshelf.statistics().pagesRead(Interval.Day))).toEqual({})
        })

        test('should be limited if given a year', () => {
            bookshelf.addReadingProgress(date(2024, 12, 31), dracula, 1, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 1), shining, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 12, 31), shining, 20, null, '')
            bookshelf.addReadingProgress(date(2026, 1, 1), dracula, 30, null, '')

            const result2024 = bookshelf.statistics(2024).pagesRead(Interval.Year)
            const result2025 = bookshelf.statistics(2025).pagesRead(Interval.Year)
            const result2026 = bookshelf.statistics(2026).pagesRead(Interval.Year)

            expect(pagesReadAsObject(result2024)).toEqual({ '2024-01-01': 1 })
            expect(pagesReadAsObject(result2025)).toEqual({ '2025-01-01': 20 })
            expect(pagesReadAsObject(result2026)).toEqual({ '2026-01-01': 29 })
        })

        test('can be grouped per day', () => {
            bookshelf.addReadingProgress(date(2024, 12, 31), dracula, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 2), dracula, 20, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 2), shining, 50, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 3), shining, 100, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 5), dracula, 30, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 7), dracula, 60, null, '')

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

        test('can be grouped per week', () => {
            bookshelf.addReadingProgress(date(2024, 12, 31), dracula, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 9), dracula, 20, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 21), shining, 100, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 21), dracula, 30, null, '')
            bookshelf.addReadingProgress(date(2025, 2, 1), dracula, 60, null, '')

            const result = bookshelf.statistics().pagesRead(Interval.Week)

            expect(pagesReadAsObject(result)).toEqual({
                '2024-12-30': 10,
                '2025-01-06': 10,
                '2025-01-13': 0,
                '2025-01-20': 110,
                '2025-01-27': 30,
            })
        })

        test('can be grouped per month', () => {
            bookshelf.addReadingProgress(date(2024, 12, 31), dracula, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 31), dracula, 20, null, '')
            bookshelf.addReadingProgress(date(2025, 2, 15), shining, 100, null, '')
            bookshelf.addReadingProgress(date(2025, 2, 15), dracula, 30, null, '')
            bookshelf.addReadingProgress(date(2025, 4, 2), dracula, 60, null, '')

            const result = bookshelf.statistics().pagesRead(Interval.Month)

            expect(pagesReadAsObject(result)).toEqual({
                '2024-12-01': 10,
                '2025-01-01': 10,
                '2025-02-01': 110,
                '2025-03-01': 0,
                '2025-04-01': 30,
            })
        })

        test('can be grouped per year', () => {
            bookshelf.addReadingProgress(date(2023, 1, 1), dracula, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 2, 15), shining, 100, null, '')
            bookshelf.addReadingProgress(date(2025, 3, 2), dracula, 50, null, '')

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

        test('should be limited if given a year', () => {
            bookshelf.addReadingProgress(date(2024, 12, 31), dracula, 1, null, '')
            bookshelf.addReadingProgress(date(2025, 1, 1), shining, 10, null, '')
            bookshelf.addReadingProgress(date(2025, 12, 31), shining, 20, null, '')
            bookshelf.addReadingProgress(date(2026, 1, 1), dracula, 30, null, '')

            expect(bookshelf.statistics(2024).totalNumberOfPages()).toEqual(1)
            expect(bookshelf.statistics(2025).totalNumberOfPages()).toEqual(20)
            expect(bookshelf.statistics(2026).totalNumberOfPages()).toEqual(29)
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
