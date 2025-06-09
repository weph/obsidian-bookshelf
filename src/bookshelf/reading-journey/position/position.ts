import { Book } from '../../book/book'
import { Page } from './page'
import { Percentage } from './percentage'
import { RomanNumeral } from './roman-numeral'
import { Time } from './time'

export type Part = 'front-matter' | 'main'

export interface Position {
    first(): Position

    next(book: Book): Position

    pageInBook(book: Book): number | null

    toString(): string

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
