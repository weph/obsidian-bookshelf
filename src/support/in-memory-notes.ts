import { Note } from '../bookshelf/note'
import { Notes } from '../bookshelf/notes'

export class InMemoryNotes implements Notes {
    private notesByName: Map<string, Note> = new Map()

    reset(): void {
        this.notesByName.clear()
    }

    add(note: Note): void {
        if (this.notesByName.has(note.basename)) {
            throw new Error(`A note with name ${note.basename} already exists`)
        }

        this.notesByName.set(note.basename, note)
    }

    noteByLink(link: string): Note | null {
        return this.notesByName.get(link.replace('[[', '').replace(']]', '')) || null
    }
}
