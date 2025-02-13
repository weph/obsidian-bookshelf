export interface Pattern<T> {
    matches: (input: string) => T | null
}

export class PatternCollection<T> implements Pattern<T> {
    constructor(private patterns: Array<Pattern<T>>) {}

    public matches(input: string): T | null {
        for (const pattern of this.patterns) {
            const matches = pattern.matches(input)

            if (matches !== null) {
                return matches
            }
        }

        return null
    }
}
