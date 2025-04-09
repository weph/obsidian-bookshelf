import { Note } from 'src/bookshelf/note/note'
import { Notes } from '../bookshelf/note/notes'
import { App, TFile } from 'obsidian'
import { ObsidianNote } from './obsidian-note'
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface'

export class ObsidianNotes implements Notes {
    private notes = new WeakMap<TFile, Note>()

    constructor(private readonly app: App) {}

    public noteByLink(link: string): Note | null {
        const bookName = link.replace('[[', '').replace(']]', '')
        const bookFile = this.app.metadataCache.getFirstLinkpathDest(bookName, '')

        if (bookFile === null) {
            return null
        }

        return this.noteByFile(bookFile)
    }

    public noteByFile(file: TFile): Note {
        if (!this.notes.has(file)) {
            this.notes.set(file, new ObsidianNote(file, this.app))
        }

        return this.notes.get(file)!
    }

    public async dailyNote(date: Date): Promise<Note> {
        const file = getDailyNote(window.moment(date), getAllDailyNotes())
        if (file !== null) {
            return this.noteByFile(file)
        }

        return this.noteByFile(await createDailyNote(window.moment(date)))
    }
}
