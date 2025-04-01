import { Note } from './note'

export interface Notes {
    noteByLink(link: string): Note | null
    dailyNote(date: Date): Promise<Note>
}
