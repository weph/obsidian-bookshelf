import { Note } from '../bookshelf/note'
import { Notes } from '../bookshelf/notes'
import { FakeNote } from './fake-note'
import { StaticMetadata } from '../bookshelf/metadata/metadata'

export class InMemoryNotes implements Notes {
    private notesByName: Map<string, Note> = new Map()

    public reset(): void {
        this.notesByName.clear()
    }

    public add(note: Note): void {
        if (this.notesByName.has(note.basename)) {
            throw new Error(`A note with name ${note.basename} already exists`)
        }

        this.notesByName.set(note.basename, note)
    }

    public noteByLink(link: string): Note | null {
        return this.notesByName.get(link.replace('[[', '').replace(']]', '')) || null
    }

    public async dailyNote(date: Date): Promise<Note> {
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

        if (!this.notesByName.has(key)) {
            this.notesByName.set(key, new FakeNote(key, new StaticMetadata({}), []))
        }

        return this.notesByName.get(key)!
    }
}
