import { Condition } from '../condition'

export class Contains implements Condition {
    constructor(private readonly value: string) {}

    public matches(value: string | null): boolean {
        if (value === null) {
            return false
        }

        return value.toLowerCase().includes(this.value.toLowerCase())
    }
}
