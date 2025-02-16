import { App, CachedMetadata, TFile } from 'obsidian'
import { Metadata, ObsidianMetadata } from 'src/metadata/metadata'
import { Note } from '../note'

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

    public async *listItems(): AsyncGenerator<string> {
        const contents = await this.app.vault.cachedRead(this.file)
        const lines = contents.split('\n')

        for (const listItem of this.meta?.listItems || []) {
            yield lines[listItem.position.start.line].replace(/^[-*]\s+/, '').trim()
        }
    }
}
