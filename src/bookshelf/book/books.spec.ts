import { describe, expect, test } from 'vitest'
import { Books } from './books'
import { BookBuilder } from '../../support/book-builder'
import { MatchField } from './search/expressions/match-field'
import { GreaterThan } from './search/conditions/greater-than'
import { GreaterEqual } from './search/conditions/greater-equal'
import { LessThan } from './search/conditions/less-than'
import { LessEqual } from './search/conditions/less-equal'

describe('Books', () => {
    describe('match', () => {
        const books = new Books([
            new BookBuilder()
                .with('title', 'The Shining')
                .with('lists', ['Classics'])
                .with('rating', 3.5)
                .withStatus('finished')
                .withReadingProgress(new Date(2025, 0, 1), 1, 1)
                .build(),
            new BookBuilder()
                .with('title', 'The Hunger Games')
                .with('lists', ['Classics', 'YA'])
                .with('series', { name: 'The Hunger Games' })
                .with('rating', 4)
                .withStatus('reading')
                .withReadingProgress(new Date(2025, 0, 2), 1, 1)
                .build(),
            new BookBuilder()
                .with('title', 'Catching Fire')
                .with('lists', ['YA'])
                .with('series', { name: 'The Hunger Games' })
                .with('rating', 4.5)
                .withStatus('unread')
                .withReadingProgress(new Date(2025, 0, 3), 1, 1)
                .build(),
            new BookBuilder().with('title', 'Vintage Games').withStatus('abandoned').build(),
            new BookBuilder()
                .with('title', 'Dracula')
                .with('lists', ['Classics'])
                .with('rating', 3)
                .withStatus('finished')
                .withReadingProgress(new Date(2025, 0, 4), 1, 1)
                .build(),
        ])

        test('rating < 3.5', () => {
            const result = books.matching(new MatchField('rating', new LessThan('3.5')))

            expect(result.map((b) => b.metadata.title)).toEqual(['Vintage Games', 'Dracula'])
        })

        test('rating <= 3.5', () => {
            const result = books.matching(new MatchField('rating', new LessEqual('3.5')))

            expect(result.map((b) => b.metadata.title)).toEqual(['The Shining', 'Vintage Games', 'Dracula'])
        })

        test('rating > 3.5', () => {
            const result = books.matching(new MatchField('rating', new GreaterThan('3')))

            expect(result.map((b) => b.metadata.title)).toEqual(['The Shining', 'The Hunger Games', 'Catching Fire'])
        })

        test('rating >= 4 ', () => {
            const result = books.matching(new MatchField('rating', new GreaterEqual('4')))

            expect(result.map((b) => b.metadata.title)).toEqual(['The Hunger Games', 'Catching Fire'])
        })

        test('date >= 2025-01-03', () => {
            const result = books.matching(new MatchField('date', new GreaterEqual('2025-01-03')))

            expect(result.map((b) => b.metadata.title)).toEqual(['Catching Fire', 'Dracula'])
        })
    })
})
