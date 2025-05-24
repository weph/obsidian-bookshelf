import { Condition } from '../condition'

export class LessThan implements Condition {
    constructor(private readonly value: string) {}

    public matches(value: string | null): boolean {
        return (value?.toLowerCase() || '') < this.value.toLowerCase()
    }
}
