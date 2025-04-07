import { Position } from './position'

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
