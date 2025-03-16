export interface PlaceholderPatterns {
    [key: string]: string
}

type Matches<Type extends PlaceholderPatterns> = {
    [Property in keyof Type]: string
}

export type Matcher<T> = (input: string) => T | null

export function transformer<T extends PlaceholderPatterns, R>(
    matcher: Matcher<T>,
    callback: (matches: Matches<T>) => R | null,
): Matcher<R> {
    return (input: string): R | null => {
        const matches = matcher(input)
        if (matches === null) {
            return null
        }

        return callback(matches)
    }
}

export function patternMatcher<T extends PlaceholderPatterns>(definition: T, pattern: string): Matcher<Matches<T>> {
    const placeholders = new Map<string, number>()
    for (const match of pattern.matchAll(/\{.+?}/g)) {
        placeholders.set(match[0], (placeholders.get(match[0]) || 0) + 1)
    }

    let regexString = pattern.replace(/\{\*}/g, '__PLACEHOLDER_WILDCARD__')
    for (const name of Object.keys(definition)) {
        const placeholder = `{${name}}`
        if (!placeholders.has(placeholder)) {
            throw new Error(`Pattern must include ${placeholder} placeholder`)
        }

        if (placeholders.get(`{${name}}`)! > 1) {
            throw new Error(`Placeholder ${placeholder} must be used only once`)
        }

        regexString = regexString.replace(`{${name}}`, `__PLACEHOLDER__${name}__`)
    }

    regexString = regexString
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // @see https://stackoverflow.com/a/6969486
        .replace(/__PLACEHOLDER_WILDCARD__/g, '.*?')

    for (const [name, pattern] of Object.entries(definition)) {
        regexString = regexString.replace(`__PLACEHOLDER__${name}__`, `(?<${name}>${pattern})`)
    }

    const regex = new RegExp(`^${regexString}$`)

    return (input: string): Matches<T> | null => {
        const matches = input.match(regex)
        if (matches === null) {
            return null
        }

        return matches.groups as Matches<T>
    }
}
