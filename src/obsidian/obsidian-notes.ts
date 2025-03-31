import { Note } from 'src/bookshelf/note'
import { Notes } from '../bookshelf/notes'
import { App, TFile } from 'obsidian'
import { ObsidianNote } from './obsidian-note'

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
}
