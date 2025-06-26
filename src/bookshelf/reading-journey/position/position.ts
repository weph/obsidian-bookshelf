import { Book } from '../../book/book'
import { Page } from './page'
import { Percentage } from './percentage'
import { RomanNumeral } from './roman-numeral'
import { Time } from './time'

export type Part = 'front-matter' | 'main'

/**
 * Represents a position within a book.
 *
 * Implementations can represent different types of positions, such as page
 * numbers, percentages, roman numerals, or playtime.
 */
export interface Position {
    /**
     * The first possible position (e.g., page 1, 0%, 0:00).
     */
    first(): Position

    /**
     * The position that follows this one, relative to the given book.
     */
    next(book: Book): Position

    /**
     * Page number equivalent of this position in the given book.
     *
     * @returns The page number or `null` if conversion isn't possible
     */
    pageInBook(book: Book): number | null

    /**
     * Human-readable representation (e.g., "25%", "xv", "1:15").
     */
    toString(): string

    /**
     * The part of the book this position belongs to.
     */
    part(): Part
}

export function position(value: number | string): Position {
    if (typeof value === 'number' && Math.round(value) === value) {
        return new Page(value)
    }

    if (typeof value === 'string') {
        const trimmedValue = value.trim()
        const parsedValue = parseInt(trimmedValue)

        if (`${parsedValue}` === trimmedValue) {
            return new Page(parsedValue)
        }

        if (`${parsedValue}%` === trimmedValue) {
            return new Percentage(parsedValue)
        }

        const factories = [RomanNumeral.fromString, Time.fromString]

        for (const factory of factories) {
            try {
                return factory(trimmedValue)
            } catch {
                // this is a little ugly
            }
        }
    }

    throw new Error(`Invalid position "${value}"`)
}
