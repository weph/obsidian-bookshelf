import { App, TFile } from 'obsidian'
import { Metadata, ObsidianMetadata } from 'src/bookshelf/metadata/metadata'
import { Note } from '../bookshelf/note'

interface Location {
    start: number
    end: number
}

interface Locations {
    section: Location | null
    list: Location | null
}

export class ObsidianNote implements Note {
    constructor(
        private file: TFile,
        private app: App,
    ) {}

    get metadata(): Metadata {
        return new ObsidianMetadata(this.obsidianMetadata)
    }

    private get obsidianMetadata() {
        return this.app.metadataCache.getFileCache(this.file) || {}
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

    public async content(): Promise<string> {
        return await this.app.vault.cachedRead(this.file)
    }

    public async *listItems(sectionHeading: string): AsyncGenerator<string> {
        const locations = await this.locations(sectionHeading)

        if (locations.list === null) {
            return
        }

        const lines = (await this.content()).split('\n')
        for (const listItem of this.obsidianMetadata.listItems || []) {
            const line = listItem.position.start.line

            if (line < locations.list?.start || line > locations.list?.end) {
                continue
            }

            yield lines[line].replace(/^[-+*]\s+/, '').trim()
        }
    }

    public async appendToList(sectionHeading: string, item: string): Promise<void> {
        const contents = await this.app.vault.cachedRead(this.file)
        const lines = contents.split('\n')

        const { section, list } = await this.locations(sectionHeading)

        if (section !== null) {
            if (list !== null) {
                const symbol = lines[list.start][0]
                lines.splice(list.end + 1, 0, `${symbol} ${item}`)
            } else {
                const nextLine = lines[section.end + 1]
                if (nextLine !== undefined && nextLine.trim() === '') {
                    lines.splice(section.end + 1, 0, '', `- ${item}`)
                } else {
                    lines.splice(section.end + 1, 0, '', `- ${item}`, '')
                }
            }
        } else {
            const markdownHeading = `## ${sectionHeading}`

            if (lines.length === 1 && lines[0] === '') {
                lines[0] = markdownHeading
                lines.push('', `- ${item}`)
            } else {
                lines.push('', markdownHeading, '', `- ${item}`)
            }
        }

        await this.app.vault.modify(this.file, lines.join('\n'))
    }

    private async locations(sectionHeading: string): Promise<Locations> {
        const contents = await this.app.vault.cachedRead(this.file)
        const lines = contents.split('\n')

        const result: Locations = { section: null, list: null }

        for (const section of this.obsidianMetadata.sections || []) {
            if (result.section === null) {
                if (section.type !== 'heading') {
                    continue
                }

                const heading = lines[section.position.start.line].replace(/^#+/, '').trim()
                if (heading === sectionHeading) {
                    result.section = { start: section.position.start.line, end: section.position.end.line }
                }
            } else {
                if (section.type === 'list') {
                    result.list = { start: section.position.start.line, end: section.position.end.line }
                }

                if (section.type === 'heading') {
                    break
                }

                result.section.end = section.position.start.line
            }
        }

        return result
    }
}
