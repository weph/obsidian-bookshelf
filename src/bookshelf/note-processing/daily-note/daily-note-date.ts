// Stryker disable next-line all
const separator = '/'
const oneOrMoreSeparator = new RegExp(`${separator}+`, 'g')
const suffix = '.md'

function join(parts: Array<string | null>): string {
    return parts
        .filter((x) => x)
        .join(separator)
        .replace(oneOrMoreSeparator, separator)
}

function split(
    notePath: string,
    dailyNoteFormat: string,
    dailyNoteFolder: string | null,
): [string, string, string] | null {
    // Stryker disable next-line all
    if (dailyNoteFolder !== null && !notePath.startsWith(dailyNoteFolder)) {
        return null
    }

    // Stryker disable next-line all
    const strippedNotePath = notePath.substring(dailyNoteFolder?.length || 0).replace(suffix, '')

    const numSeparators = (dailyNoteFormat.match(oneOrMoreSeparator) || []).length
    const parts = strippedNotePath.split(separator)
    const prefix = join([dailyNoteFolder, ...parts.splice(0, parts.length - 1 - numSeparators)])
    const name = join(parts)

    return [prefix, name, suffix]
}

export function dailyNoteDate(notePath: string, dailyNoteFormat: string, dailyNoteFolder: string | null): Date | null {
    const parts = split(notePath, dailyNoteFormat, dailyNoteFolder)
    if (parts === null) {
        return null
    }

    const [prefix, main, suffix] = parts
    const date = window.moment(main, dailyNoteFormat)

    const foo = join([prefix, date.format(dailyNoteFormat) + suffix])

    return notePath === foo ? date.toDate() : null
}
