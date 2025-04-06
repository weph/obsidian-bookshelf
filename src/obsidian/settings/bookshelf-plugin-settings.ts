export const BOOK_NOTE = 'bookNote'
export const DAILY_NOTE = 'dailyNote'

export const ALL_NOTES = [BOOK_NOTE, DAILY_NOTE] as const

export type NoteType = (typeof ALL_NOTES)[number]

export * from './versions/bookshelf-settings-version-20250406'
