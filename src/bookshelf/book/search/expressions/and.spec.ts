import { describe, expect, test } from 'vitest'
import { Expression } from '../expression'
import { Book } from '../../book'
import { BookBuilder } from '../../../../support/book-builder'
import { And } from './and'

class MatchesBook implements Expression {
    constructor(private readonly book: Book) {}

    matches(book: Book): boolean {
        return book === this.book
    }
}

class DoesNotMatchBook implements Expression {
    matches(): boolean {
        return false
    }
}

describe('And', () => {
    const book = new BookBuilder().build()

    test('should match if all expressions match', () => {
        const expression = new And([new MatchesBook(book), new MatchesBook(book)])

        expect(expression.matches(book)).toBe(true)
    })

    test('must not match if at least one expression does not match', () => {
        const expression = new And([new MatchesBook(book), new MatchesBook(book), new DoesNotMatchBook()])

        expect(expression.matches(book)).toBe(false)
    })
})
