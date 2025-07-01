import { Part, Position } from './position'
import * as romans from 'romans'

export class RomanNumeral implements Position {
    constructor(private value: number) {}

    public static fromString(input: string): RomanNumeral {
        return new RomanNumeral(romans.deromanize(input.toUpperCase()))
    }

    public first(): Position {
        return new RomanNumeral(1)
    }

    public last(): null {
        return null
    }

    public next(): Position {
        return new RomanNumeral(this.value + 1)
    }

    public pageInBook(): number {
        return this.value
    }

    public toString(): string {
        return romans.romanize(this.value).toLowerCase()
    }

    public part(): Part {
        return 'front-matter'
    }
}
