import { Book } from '../../book'
import { Page } from './page'

export interface Position {
    first(): Position

    next(): Position

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
    }

    throw new Error(`Invalid position "${value}"`)
}
