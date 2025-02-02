import { beforeEach, describe, expect, test } from '@jest/globals'
import { Bookshelf } from './bookshelf'
import { Book } from './book'
import { BookshelfError } from './bookshelf-error'

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

    expect(Array.from(result)).toEqual([shining, animalFarm, dracula])
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
        expect(bookshelf.book('the-shining')).toBe(shining)
    })

    test('it can not be added again', () => {
        expect(() => bookshelf.add('the-shining', shining)).toThrow(BookshelfError.identifierExists('the-shining'))
    })

    test('no other book can be added using the same identifier', () => {
        const other = book('Another Book')

        expect(() => bookshelf.add('the-shining', other)).toThrow(BookshelfError.identifierExists('the-shining'))
    })
})

function book(title: string): Book {
    return new Book(title)
}
