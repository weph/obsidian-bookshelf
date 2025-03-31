import { Note } from './note'

export interface Notes {
    noteByLink(link: string): Note | null
}
