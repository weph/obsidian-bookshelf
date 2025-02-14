import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { assign, debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { ObsidianMetadata } from '../metadata/metadata'
import { BookMetadataFactory } from '../book-metadata-factory'
import { PatternCollection } from '../reading-journey/pattern/pattern-collection'
import { StatisticsView, VIEW_TYPE_STATISTICS } from './view/statistics-view'
import { DailyNotePatternMatches, dailyNotePatterns } from '../reading-journey/pattern/daily-note/daily-note-pattern'
import { BookNotePatternMatches, bookNotePatterns } from '../reading-journey/pattern/book-note/book-note-pattern'

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    private bookFactory: BookMetadataFactory

    private libraryView: LibraryView | null = null

    private statisticsView: StatisticsView | null = null

    private bookNotePatterns: PatternCollection<BookNotePatternMatches>

    private dailyNotePatterns: PatternCollection<DailyNotePatternMatches>

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf()
        this.bookFactory = new BookMetadataFactory(this.settings.bookProperties, this.linkToUri.bind(this))

        this.bookNotePatterns = bookNotePatterns(this.settings.bookNote.patterns, this.settings.bookNote.dateFormat)
        this.dailyNotePatterns = dailyNotePatterns(this.settings.dailyNote.patterns)

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))

        this.registerView(VIEW_TYPE_LIBRARY, (leaf) => {
            this.libraryView = new LibraryView(leaf, this.bookshelf)

            return this.libraryView
        })

        this.registerView(VIEW_TYPE_STATISTICS, (leaf) => {
            this.statisticsView = new StatisticsView(leaf, this.bookshelf)

            return this.statisticsView
        })

        this.addRibbonIcon('library-big', 'Bookshelf: Library', () => this.activateView(VIEW_TYPE_LIBRARY))
        this.addRibbonIcon('chart-spline', 'Bookshelf: Statistics', () => this.activateView(VIEW_TYPE_STATISTICS))

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

        const source = file.path
        const identifier = file.path

        const meta = this.app.metadataCache.getFileCache(file) || {}
        if (!this.bookshelf.has(identifier)) {
            this.bookshelf.add(identifier, this.bookFactory.create(file.basename, new ObsidianMetadata(meta)))
        }

        this.bookshelf.removeFromJourneyBySource(source)
        for await (const listItem of this.listItems(file)) {
            const matches = this.bookNotePatterns.matches(listItem)
            if (matches === null) {
                continue
            }

            if (matches.action === 'progress') {
                this.bookshelf.addReadingProgress(
                    matches.date,
                    identifier,
                    matches.endPage,
                    matches.startPage || null,
                    source,
                )
                continue
            }

            this.bookshelf.addActionToJourney(matches.date, identifier, matches.action, source)
        }

        this.updateView()
    }

    private async handleDailyNote(file: TFile): Promise<void> {
        const dateMatches = file.basename.match(/(\d{4})-(\d{2})-(\d{2})/)
        if (dateMatches === null) {
            return
        }

        const source = file.path
        const date = new Date(parseInt(dateMatches[1]), parseInt(dateMatches[2]) - 1, parseInt(dateMatches[3]))

        this.bookshelf.removeFromJourneyBySource(source)
        for await (const listItem of this.listItems(file)) {
            const matches = this.dailyNotePatterns.matches(listItem)
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

            if (matches.action === 'progress') {
                this.bookshelf.addReadingProgress(date, identifier, matches.endPage, matches.startPage || null, source)
                continue
            }

            this.bookshelf.addActionToJourney(date, identifier, matches.action, source)
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

    private updateView = debounce({ delay: 100 }, () => {
        this.libraryView?.update()
        this.statisticsView?.update()
    })

    private async activateView(viewType: string): Promise<void> {
        const { workspace } = this.app

        const leaves = workspace.getLeavesOfType(viewType)
        if (leaves.length > 0) {
            await workspace.revealLeaf(leaves[0])
            return
        }

        const leaf = workspace.getLeaf('tab')
        await leaf.setViewState({ type: viewType, active: true })
        await workspace.revealLeaf(leaf)
    }

    async loadSettings() {
        this.settings = assign(DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}
