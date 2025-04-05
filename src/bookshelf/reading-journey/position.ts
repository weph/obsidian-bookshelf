import { Book } from '../book'

export interface Position {
    first(): Position

    next(): Position

    pageInBook(book: Book): number

    toString(): string
}

export class Page implements Position {
    constructor(private value: number) {}

    public first(): Position {
        return new Page(1)
    }

    public next(): Position {
        return new Page(this.value + 1)
    }

    public pageInBook(): number {
        return this.value
    }

    public toString(): string {
        return this.value.toString()
    }
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
