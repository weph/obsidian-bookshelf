export interface PlaceholderPatterns {
    [key: string]: string
}

type Matches<Type extends PlaceholderPatterns> = {
    [Property in keyof Type]: string
}

export class Pattern<T extends PlaceholderPatterns> {
    private readonly regex: RegExp

    constructor(definition: T, pattern: string) {
        const placeholders = new Map<string, number>()
        for (const match of pattern.matchAll(/\{.+?}/g)) {
            placeholders.set(match[0], (placeholders.get(match[0]) || 0) + 1)
        }

        let regex = pattern.replace(/\{\*}/g, '.*?')
        for (const [name, pattern] of Object.entries(definition)) {
            const placeholder = `{${name}}`
            if (!placeholders.has(placeholder)) {
                throw new Error(`Pattern must include ${placeholder} placeholder`)
            }

            if (placeholders.get(`{${name}}`)! > 1) {
                throw new Error(`Placeholder ${placeholder} must be used only once`)
            }

            regex = regex.replace(`{${name}}`, `(?<${name}>${pattern})`)
        }

        this.regex = new RegExp(`^${regex}$`)
    }

    public matches(input: string): Matches<T> | null {
        const matches = input.match(this.regex)
        if (matches === null) {
            return null
        }

        return matches.groups as Matches<T>
    }
}
