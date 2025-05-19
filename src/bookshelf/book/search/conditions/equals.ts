import { Condition } from '../condition'

export class Equals implements Condition {
    constructor(private readonly value: string) {}

    public matches(value: string | null): boolean {
        return this.value.toLowerCase() === value?.toLowerCase()
    }
}
