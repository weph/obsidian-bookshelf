export function dailyNoteDate(notePath: string, dailyNoteFormat: string, dailyNoteFolder: string | null): Date | null {
    if (dailyNoteFolder !== null && !notePath.startsWith(dailyNoteFolder)) {
        return null
    }

    const date = window.moment(notePath, dailyNoteFormat)

    return notePath.includes(date.format(dailyNoteFormat)) ? date.toDate() : null
}
