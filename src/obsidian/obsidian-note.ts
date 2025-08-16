import { App, CachedMetadata, FrontmatterLinkCache, TFile } from 'obsidian'
import { Metadata, PropertyValue } from 'src/bookshelf/note/metadata'
import { Note } from '../bookshelf/note/note'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { DateTime } from 'luxon'

interface Location {
    start: number
    end: number
}

interface Locations {
    section: Location | null
    list: Location | null
}

interface UpdateInfo {
    newlineBeforeSection: boolean
    addSection: boolean

    newlineBeforeList: boolean
    newlineAfterList: boolean
    listSymbol: string

    line: number
    linesToReplace: number
}

class ObsidianMetadata implements Metadata {
    private links = new Map<string, FrontmatterLinkCache>()

    private metadata: CachedMetadata

    constructor(
        private app: App,
        private file: TFile,
    ) {
        this.metadata = this.app.metadataCache.getFileCache(this.file) || {}

        for (const link of this.metadata.frontmatterLinks || []) {
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
    public readonly createdAt: Date

    constructor(
        private file: TFile,
        private app: App,
    ) {
        this.createdAt = DateTime.fromMillis(this.file.stat.ctime).toJSDate()
    }

    get metadata(): Metadata {
        return new ObsidianMetadata(this.app, this.file)
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
        const metadata = this.app.metadataCache.getFileCache(this.file) || {}

        const first = metadata.headings?.[0]

        if (first === undefined || first.level !== 1) {
            return null
        }

        return first.heading
    }

    public async content(): Promise<string> {
        return await this.app.vault.cachedRead(this.file)
    }

    public async listItems(sectionHeading: string): Promise<Array<string>> {
        const lines = (await this.content()).split('\n')
        const locations = await this.locations(sectionHeading, lines)
        const metadata = this.app.metadataCache.getFileCache(this.file) || {}

        if (locations.list === null || metadata.listItems === undefined) {
            return []
        }

        const result = []

        for (const listItem of metadata.listItems || []) {
            const line = listItem.position.start.line

            if (line < locations.list?.start || line > locations.list?.end) {
                continue
            }

            result.push(lines[line].replace(/^[-+*]\s+/, '').trim())
        }

        return result
    }

    public async appendToList(sectionHeading: string, items: Array<string>): Promise<void> {
        const contents = await this.app.vault.read(this.file)
        const lines = contents.split('\n')

        const update = await this.updateInfo(sectionHeading, lines)

        const newLines = []

        if (update.newlineBeforeSection) {
            newLines.push('')
        }

        if (update.addSection) {
            newLines.push(`## ${sectionHeading}`)
        }

        if (update.newlineBeforeList) {
            newLines.push('')
        }

        newLines.push(...items.map((item) => `${update.listSymbol} ${item}`))

        if (update.newlineAfterList) {
            newLines.push('')
        }

        lines.splice(update.line, update.linesToReplace, ...newLines)

        await this.app.vault.modify(this.file, lines.join('\n'))
    }

    private async updateInfo(sectionHeading: string, lines: Array<string>): Promise<UpdateInfo> {
        // Default: Append new section at the end of note
        const defaultCase = {
            newlineBeforeSection: true,
            addSection: true,

            newlineBeforeList: true,
            newlineAfterList: false,
            listSymbol: '-',

            line: lines.length + 1,
            linesToReplace: 0,
        }

        // Replace empty note with section
        if (lines.length === 1 && lines[0] === '') {
            return {
                ...defaultCase,
                line: 0,
                linesToReplace: lines.length,
                newlineBeforeSection: false,
            }
        }

        const { section, list } = await this.locations(sectionHeading, lines)

        // Reuse existing list
        if (list !== null) {
            return {
                ...defaultCase,
                addSection: false,
                newlineBeforeList: false,
                line: list.end + 1,
                listSymbol: lines[list.start][0],
                newlineBeforeSection: false,
            }
        }

        // Reuse existing section
        if (section !== null) {
            return {
                ...defaultCase,
                addSection: false,
                line: section.end + 1,
                newlineBeforeSection: false,
                newlineAfterList: lines[section.end + 1] === undefined || lines[section.end + 1].trim() !== '',
            }
        }

        return defaultCase
    }

    private async locations(sectionHeading: string, lines: Array<string>): Promise<Locations> {
        const result: Locations = { section: null, list: null }

        const tree = fromMarkdown(lines.join('\n'))

        for (const child of tree.children) {
            if (result.section === null) {
                if (child.type !== 'heading' || child.children.length === 0) {
                    continue
                }

                const headingChild = child.children[0]
                const heading = headingChild.type === 'text' ? headingChild.value : ''
                if (heading === sectionHeading) {
                    result.section = { start: child.position!.start.line - 1, end: child.position!.end.line - 1 }
                }
            } else {
                if (child.type === 'list') {
                    result.list = { start: child.position!.start.line - 1, end: child.position!.end.line - 1 }
                }

                if (child.type === 'heading') {
                    break
                }

                result.section.end = child.position!.start.line - 1
            }
        }

        return result
    }
}
