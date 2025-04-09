import { Book } from '../../book/book'
import { Page } from './page'
import { Percentage } from './percentage'

export interface Position {
    first(): Position

    next(book: Book): Position

    pageInBook(book: Book): number

    toString(): string
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
    }

    throw new Error(`Invalid position "${value}"`)
}
