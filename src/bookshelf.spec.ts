import { beforeEach, describe, expect, test } from '@jest/globals'
import { Bookshelf } from './bookshelf'
import { BookMetadata } from './book'
import { BookshelfError } from './bookshelf-error'
import { ReadingProgress } from './reading-progress'

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

describe('Reading progress', () => {
    const dracula = 'dracula'
    const shining = 'shining'

    beforeEach(() => {
        bookshelf.add(dracula, book('Dracula'))
        bookshelf.add(shining, book('The Shining'))
    })

    test('should be ordered by date', () => {
        bookshelf.addReadingProgress(date(2025, 2, 3), dracula, 10, 1)
        bookshelf.addReadingProgress(date(2025, 2, 4), shining, 50)
        bookshelf.addReadingProgress(date(2025, 2, 5), dracula, 20)
        bookshelf.addReadingProgress(date(2025, 2, 1), shining, 20, 10)

        const progress = bookshelf.readingProgress()

        expect(progress.map(readingProgressAsString)).toEqual([
            '2025-02-01: The Shining: 10-20',
            '2025-02-03: Dracula: 1-10',
            '2025-02-04: The Shining: 21-50',
            '2025-02-05: Dracula: 11-20',
        ])
    })

    test('should by reflected in book', () => {
        bookshelf.addReadingProgress(date(2025, 2, 3), dracula, 10, 1)
        bookshelf.addReadingProgress(date(2025, 2, 4), shining, 50)
        bookshelf.addReadingProgress(date(2025, 2, 5), dracula, 20)
        bookshelf.addReadingProgress(date(2025, 2, 1), shining, 20, 10)

        expect(bookshelf.book(dracula).readingProgress.map(readingProgressAsString)).toEqual([
            '2025-02-03: Dracula: 1-10',
            '2025-02-05: Dracula: 11-20',
        ])
        expect(bookshelf.book(shining).readingProgress.map(readingProgressAsString)).toEqual([
            '2025-02-01: The Shining: 10-20',
            '2025-02-04: The Shining: 21-50',
        ])
    })

    test('items on the same date should be returned in the order of addition', () => {
        bookshelf.addReadingProgress(date(2025, 1, 1), dracula, 1)
        bookshelf.addReadingProgress(date(2025, 1, 1), shining, 2)
        bookshelf.addReadingProgress(date(2025, 1, 2), shining, 3)
        bookshelf.addReadingProgress(date(2025, 1, 2), dracula, 4)

        const progress = bookshelf.readingProgress()

        expect(progress.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-1',
            '2025-01-01: The Shining: 1-2',
            '2025-01-02: The Shining: 3-3',
            '2025-01-02: Dracula: 2-4',
        ])
    })

    test('items should be connected properly even if added in arbitrary order', () => {
        bookshelf.addReadingProgress(date(2025, 1, 1), dracula, 10)
        bookshelf.addReadingProgress(date(2025, 1, 3), dracula, 30)
        bookshelf.addReadingProgress(date(2025, 1, 2), dracula, 20)

        const progress = bookshelf.readingProgress()

        expect(progress.map(readingProgressAsString)).toEqual([
            '2025-01-01: Dracula: 1-10',
            '2025-01-02: Dracula: 11-20',
            '2025-01-03: Dracula: 21-30',
        ])
    })
})

function readingProgressAsString(value: ReadingProgress): string {
    return `${value.date.getFullYear()}-${(value.date.getMonth() + 1).toString().padStart(2, '0')}-${value.date.getDate().toString().padStart(2, '0')}: ${value.book.metadata.title}: ${value.startPage}-${value.endPage}`
}

function date(year: number, month: number, day: number): Date {
    return new Date(year, month - 1, day, 0, 0, 0, 0)
}

function book(title: string): BookMetadata {
    return { title }
}
