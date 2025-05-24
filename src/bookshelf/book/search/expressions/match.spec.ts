import { describe, expect, test } from 'vitest'
import { BookBuilder } from '../../../../support/book-builder'
import { Link } from '../../link'
import { Match } from './match'
import { Contains } from '../conditions/contains'

describe('MatchField', () => {
    const book = new BookBuilder()
        .with('title', 'A Book Title')
        .with('authors', ['Joe Schmoe', new Link('internal', 'Jane Doe', 'J. Doe', '')])
        .with('series', { name: 'The Ultimate Series' })
        .with('lists', ['List A', 'List B'])
        .with('rating', 3.5)
        .with('published', new Date(2025, 5, 15))
        .build()

    test('should match title', () => {
        expect(new Match(new Contains('book title')).matches(book)).toBe(true)
    })

    test('should match author', () => {
        expect(new Match(new Contains('j. doe')).matches(book)).toBe(true)
    })

    test('should match series', () => {
        expect(new Match(new Contains('ultimate series')).matches(book)).toBe(true)
    })
})
