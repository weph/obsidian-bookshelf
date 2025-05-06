import { App, CachedMetadata, FrontmatterLinkCache, TFile } from 'obsidian'
import { Metadata, PropertyValue } from 'src/bookshelf/note/metadata'
import { Note } from '../bookshelf/note/note'

interface Location {
    start: number
    end: number
}

interface Locations {
    section: Location | null
    list: Location | null
}

class ObsidianMetadata implements Metadata {
    private links = new Map<string, FrontmatterLinkCache>()

    constructor(
        private app: App,
        private file: TFile,
        private metadata: CachedMetadata,
    ) {
        for (const link of metadata.frontmatterLinks || []) {
            this.links.set(link.key, link)
        }
    }

    public async set(property: string, value: PropertyValue | Array<PropertyValue> | null): Promise<void> {
        await this.app.fileManager.processFrontMatter(this.file, (frontmatter) => (frontmatter[property] = value))
    }

    public value(property: string): PropertyValue | Array<PropertyValue> | null {
        const value = this.metadata.frontmatter?.[property] || null

        if (Array.isArray(value)) {
            return value.map((v, i) => this.links.get(`${property}.${i}`) || v)
        }

        return this.links.get(property) || value
    }
}

export class ObsidianNote implements Note {
    constructor(
        private file: TFile,
        private app: App,
    ) {}

    get metadata(): Metadata {
        return new ObsidianMetadata(this.app, this.file, this.obsidianMetadata)
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

    get heading(): string | null {
        const first = this.obsidianMetadata.headings?.[0]

        if (first === undefined || first.level !== 1) {
            return null
        }

        return first.heading
    }

    public async content(): Promise<string> {
        return await this.app.vault.cachedRead(this.file)
    }

    public async *listItems(sectionHeading: string): AsyncGenerator<string> {
        const lines = (await this.content()).split('\n')
        const locations = await this.locations(sectionHeading, lines)

        if (locations.list === null) {
            return
        }

        for (const listItem of this.obsidianMetadata.listItems || []) {
            const line = listItem.position.start.line

            if (line < locations.list?.start || line > locations.list?.end) {
                continue
            }

            yield lines[line].replace(/^[-+*]\s+/, '').trim()
        }
    }

    public async appendToList(sectionHeading: string, item: string): Promise<void> {
        const contents = await this.app.vault.read(this.file)
        const lines = contents.split('\n')

        const { section, list } = await this.locations(sectionHeading, lines)

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

    private async locations(sectionHeading: string, lines: Array<string>): Promise<Locations> {
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
