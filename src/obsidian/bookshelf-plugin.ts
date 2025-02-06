import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { ObsidianMetadata } from '../metadata/metadata'
import { BookMetadataFactory } from '../book-metadata-factory'
import { BookNoteProgressPattern, BookNoteProgressPatternMatches } from '../book-note-progress-pattern'
import { DailyNoteProgressPattern, DailyNoteProgressPatternMatches } from '../daily-note-progress-pattern'
import { PatternCollection } from '../pattern-collection'

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    private bookFactory: BookMetadataFactory

    private libraryView: LibraryView | null = null

    private bookNoteProgressPatterns: PatternCollection<BookNoteProgressPatternMatches>

    private dailyNoteProgressPatterns: PatternCollection<DailyNoteProgressPatternMatches>

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf()
        this.bookFactory = new BookMetadataFactory(this.settings.bookProperties, this.linkToUri.bind(this))

        const bookNotePatterns = []
        const dateFormat = this.settings.bookNote.dateFormat
        for (const pattern of this.settings.bookNote.patterns.progress) {
            try {
                bookNotePatterns.push(new BookNoteProgressPattern(pattern, dateFormat))
            } catch (error) {
                console.error(`Error processing pattern "${pattern}: ${error}`)
            }
        }

        this.bookNoteProgressPatterns = new PatternCollection(bookNotePatterns)

        const dailyNotePatterns = []
        for (const pattern of this.settings.dailyNote.patterns.progress) {
            try {
                dailyNotePatterns.push(new DailyNoteProgressPattern(pattern))
            } catch (error) {
                console.error(`Error processing pattern "${pattern}: ${error}`)
            }
        }

        this.dailyNoteProgressPatterns = new PatternCollection(dailyNotePatterns)

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))

        this.registerView(VIEW_TYPE_LIBRARY, (leaf) => {
            this.libraryView = new LibraryView(leaf, this.bookshelf)

            return this.libraryView
        })

        this.addRibbonIcon('library-big', 'Bookshelf', () => {
            this.activateView()
        })

        this.app.metadataCache.on('resolve', async (file) => await this.handleFile(file))
    }

    private async handleFile(file: TFile): Promise<void> {
        await this.handleBookNote(file)
        await this.handleDailyNote(file)
    }

    private async handleBookNote(file: TFile): Promise<void> {
        if (!this.isBookNote(file)) {
            return
        }

        const identifier = file.path

        const meta = this.app.metadataCache.getFileCache(file) || {}
        if (!this.bookshelf.has(identifier)) {
            this.bookshelf.add(identifier, this.bookFactory.create(file.basename, new ObsidianMetadata(meta)))
        }

        for await (const listItem of this.listItems(file)) {
            const matches = this.bookNoteProgressPatterns.matches(listItem)
            if (matches === null) {
                continue
            }

            this.bookshelf.addReadingProgress(matches.date, identifier, matches.endPage, matches.startPage)
        }

        this.updateView()
    }

    private async handleDailyNote(file: TFile): Promise<void> {
        const dateMatches = file.basename.match(/(\d{4})-(\d{2})-(\d{2})/)
        if (dateMatches === null) {
            return
        }

        const date = new Date(parseInt(dateMatches[1]), parseInt(dateMatches[2]) - 1, parseInt(dateMatches[3]))

        for await (const listItem of this.listItems(file)) {
            const matches = this.dailyNoteProgressPatterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const bookName = matches.book.replace('[[', '').replace(']]', '')
            const bookFile = this.app.metadataCache.getFirstLinkpathDest(bookName, '')

            if (bookFile === null) {
                continue
            }

            const identifier = bookFile.path

            if (!this.bookshelf.has(identifier)) {
                this.bookshelf.add(identifier, { title: identifier })
            }

            this.bookshelf.addReadingProgress(date, identifier, matches.endPage, matches.startPage)
        }

        this.updateView()
    }

    private async *listItems(file: TFile): AsyncGenerator<string> {
        const contents = await this.app.vault.cachedRead(file)
        const meta = this.app.metadataCache.getFileCache(file)
        const lines = contents.split('\n')

        for (const listItem of meta?.listItems || []) {
            yield lines[listItem.position.start.line].replace(/^[-*]\s+/, '')
        }
    }

    private isBookNote(file: TFile): boolean {
        return this.settings.booksFolder !== '' && file.path.startsWith(this.settings.booksFolder)
    }

    private linkToUri(link: string): string {
        const coverFile = this.app.metadataCache.getFirstLinkpathDest(link, '')

        if (coverFile === null) {
            return ''
        }

        return this.app.vault.getResourcePath(coverFile)
    }

    private updateView = debounce({ delay: 100 }, () => this.libraryView?.update())

    private async activateView(): Promise<void> {
        const { workspace } = this.app

        const leaves = workspace.getLeavesOfType(VIEW_TYPE_LIBRARY)
        if (leaves.length > 0) {
            await workspace.revealLeaf(leaves[0])
            return
        }

        const leaf = workspace.getLeaf('tab')
        await leaf.setViewState({ type: VIEW_TYPE_LIBRARY, active: true })
        await workspace.revealLeaf(leaf)
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}
