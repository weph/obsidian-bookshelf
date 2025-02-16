import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { assign, debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { BookMetadataFactory } from '../book-metadata-factory'
import { PatternCollection } from '../reading-journey/pattern/pattern-collection'
import { StatisticsView, VIEW_TYPE_STATISTICS } from './view/statistics-view'
import { DailyNotePatternMatches, dailyNotePatterns } from '../reading-journey/pattern/daily-note/daily-note-pattern'
import { BookNotePatternMatches, bookNotePatterns } from '../reading-journey/pattern/book-note/book-note-pattern'
import { Note } from '../note'
import { ObsidianNote } from './obsidian-note'

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    private bookFactory: BookMetadataFactory

    private bookNotePatterns: PatternCollection<BookNotePatternMatches>

    private dailyNotePatterns: PatternCollection<DailyNotePatternMatches>

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf()
        this.bookFactory = new BookMetadataFactory(this.settings.bookProperties, this.linkToUri.bind(this))

        this.bookNotePatterns = bookNotePatterns(this.settings.bookNote.patterns, this.settings.bookNote.dateFormat)
        this.dailyNotePatterns = dailyNotePatterns(this.settings.dailyNote.patterns)

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))

        this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this.bookshelf))
        this.registerView(VIEW_TYPE_STATISTICS, (leaf) => new StatisticsView(leaf, this.bookshelf))

        this.addRibbonIcon('library-big', 'Bookshelf: Library', () => this.activateView(VIEW_TYPE_LIBRARY))
        this.addRibbonIcon('chart-spline', 'Bookshelf: Statistics', () => this.activateView(VIEW_TYPE_STATISTICS))

        this.app.metadataCache.on('resolve', async (file) => await this.handleFile(file))
        this.app.metadataCache.on('changed', async (file) => await this.handleFile(file))
    }

    private async handleFile(file: TFile): Promise<void> {
        const note = new ObsidianNote(file, this.app)

        await this.handleBookNote(note)
        await this.handleDailyNote(note)
    }

    private async handleBookNote(note: Note): Promise<void> {
        if (!this.isBookNote(note)) {
            return
        }

        const identifier = note.identifier

        const bookMetadata = this.bookFactory.create(note.basename, note.metadata)
        if (this.bookshelf.has(identifier)) {
            this.bookshelf.update(identifier, bookMetadata)
        } else {
            this.bookshelf.add(identifier, bookMetadata)
        }

        await this.processReadingJourney(
            note,
            this.bookNotePatterns,
            () => identifier,
            (matches) => matches.date,
        )

        this.updateView()
    }

    private async handleDailyNote(note: Note): Promise<void> {
        const dateMatches = note.basename.match(/(\d{4})-(\d{2})-(\d{2})/)
        if (dateMatches === null) {
            return
        }

        const date = new Date(parseInt(dateMatches[1]), parseInt(dateMatches[2]) - 1, parseInt(dateMatches[3]))

        await this.processReadingJourney(
            note,
            this.dailyNotePatterns,
            (matches) => this.bookIdentifier(matches.book),
            () => date,
        )

        this.updateView()
    }

    private bookIdentifier(input: string): string {
        const bookName = input.replace('[[', '').replace(']]', '')
        const bookFile = this.app.metadataCache.getFirstLinkpathDest(bookName, '')

        return bookFile === null ? bookName : bookFile.path
    }

    private async processReadingJourney<T extends BookNotePatternMatches | DailyNotePatternMatches>(
        note: Note,
        patterns: PatternCollection<T>,
        identifierValue: (matches: T) => string,
        dateValue: (matches: T) => Date,
    ): Promise<void> {
        const source = note.path

        this.bookshelf.removeFromJourneyBySource(source)
        for await (const listItem of note.listItems()) {
            const matches = patterns.matches(listItem)
            if (matches === null) {
                continue
            }

            const identifier = identifierValue(matches)
            const date = dateValue(matches)

            if (!this.bookshelf.has(identifier)) {
                this.bookshelf.add(identifier, { title: identifier })
            }

            if (matches.action === 'progress') {
                this.bookshelf.addReadingProgress(date, identifier, matches.endPage, matches.startPage || null, source)
                continue
            }

            this.bookshelf.addActionToJourney(date, identifier, matches.action, source)
        }
    }

    private isBookNote(note: Note): boolean {
        return this.settings.booksFolder !== '' && note.path.startsWith(this.settings.booksFolder)
    }

    private linkToUri(link: string): string {
        const coverFile = this.app.metadataCache.getFirstLinkpathDest(link, '')

        if (coverFile === null) {
            return ''
        }

        return this.app.vault.getResourcePath(coverFile)
    }

    private updateView = debounce({ delay: 100 }, () => {
        for (const view of [VIEW_TYPE_LIBRARY, VIEW_TYPE_STATISTICS]) {
            for (const leaf of this.app.workspace.getLeavesOfType(view)) {
                if ('update' in leaf.view && typeof leaf.view.update === 'function') {
                    leaf.view.update()
                }
            }
        }
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
