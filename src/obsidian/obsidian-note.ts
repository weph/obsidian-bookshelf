import { App, CachedMetadata, TFile } from 'obsidian'
import { Metadata, ObsidianMetadata } from 'src/bookshelf/metadata/metadata'
import { Note } from '../bookshelf/note'

export class ObsidianNote implements Note {
    private readonly meta: CachedMetadata

    public readonly metadata: Metadata

    constructor(
        private file: TFile,
        private app: App,
    ) {
        this.meta = this.app.metadataCache.getFileCache(file) || {}
        this.metadata = new ObsidianMetadata(this.meta)
    }

    get identifier(): string {
        return this.file.path
    }

    get path(): string {
        return this.file.path
    }

    get basename(): string {
        return this.file.basename
    }

    public async *listItems(sectionHeading: string): AsyncGenerator<string> {
        const contents = await this.app.vault.cachedRead(this.file)
        const lines = contents.split('\n')

        let sectionStart: number | null = null
        let sectionEnd: number | null = null

        for (const section of this.meta?.sections || []) {
            if (sectionStart === null) {
                if (section.type !== 'heading') {
                    continue
                }

                const heading = lines[section.position.start.line].replace(/^#+/, '').trim()
                if (heading === sectionHeading) {
                    sectionStart = section.position.start.line
                }
            } else {
                if (section.type === 'heading') {
                    sectionEnd = section.position.start.line
                    break
                }
            }
        }

        if (sectionStart === null) {
            return
        }

        if (sectionEnd === null) {
            sectionEnd = lines.length
        }

        for (const listItem of this.meta?.listItems || []) {
            const line = listItem.position.start.line

            if (line < sectionStart || line > sectionEnd) {
                continue
            }

            yield lines[line].replace(/^[-*]\s+/, '').trim()
        }
    }
}
