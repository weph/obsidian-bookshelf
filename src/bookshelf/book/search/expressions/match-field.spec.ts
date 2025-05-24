import { describe, expect, test } from 'vitest'
import { MatchField } from './match-field'
import { BookBuilder } from '../../../../support/book-builder'
import { Link } from '../../link'
import { Equals } from '../conditions/equals'

describe('MatchField', () => {
    const book = new BookBuilder()
        .with('title', 'A Book Title')
        .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
        .with('lists', ['List A', 'List B'])
        .with('rating', 3.5)
        .with('published', new Date(2025, 5, 15))
        .with('series', { name: 'A Series' })
        .withStatus('finished')
        .withReadingProgress(new Date(2025, 0, 1), 1, 10)
        .withReadingProgress(new Date(2025, 1, 1), 11, 50)
        .withReadingProgress(new Date(2025, 2, 15), 51, 100)
        .build()

    describe('Title', () => {
        test('should match correct value', () => {
            const expression = new MatchField('title', new Equals('A Book Title'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('title', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('Author', () => {
        test('should match correct value (string)', () => {
            const expression = new MatchField('author', new Equals('Joe Schmoe'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('should match correct value (link)', () => {
            const expression = new MatchField('author', new Equals('J. Doe'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('author', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('Rating', () => {
        test('should match correct value', () => {
            const expression = new MatchField('rating', new Equals('3.5'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('rating', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('List', () => {
        test('should match correct value', () => {
            const expression = new MatchField('list', new Equals('List B'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('list', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('Series', () => {
        test('should match correct value', () => {
            const expression = new MatchField('series', new Equals('A Series'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('series', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('Status', () => {
        test('should match correct value', () => {
            const expression = new MatchField('status', new Equals('finished'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('status', new Equals('x'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })

    describe('Reading Progress Date', () => {
        test('should match correct value', () => {
            const expression = new MatchField('date', new Equals('2025-02-01'))

            expect(expression.matches(book)).toBeTruthy()
        })

        test('must not match incorrect value', () => {
            const expression = new MatchField('date', new Equals('2025-02-02'))

            expect(expression.matches(book)).toBeFalsy()
        })
    })
})
