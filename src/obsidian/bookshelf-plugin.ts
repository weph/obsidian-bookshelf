import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf/bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { assign, debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { StatisticsView, VIEW_TYPE_STATISTICS } from './view/statistics-view'
import { BookshelfFactory } from '../bookshelf/bookshelf-factory'
import { Book } from '../bookshelf/book/book'
import { BookModal } from './modal/book-modal'
import './bookshelf-plugin.css'
import { ObsidianNotes } from './obsidian-notes'
import { migratedSettings } from './settings/versions/migrated-settings'
import { BookshelfReference } from '../bookshelf/bookshelf-reference'
import { Subscribers } from '../bookshelf/subscriber/subscribers'

export interface DailyNotesSettings {
    enabled: boolean
    format: string
    folder: string | null
}

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private notes: ObsidianNotes

    private subscribers: Subscribers

    private bookshelf: BookshelfReference

    async onload() {
        await this.loadSettings()

        this.notes = new ObsidianNotes(this.app)
        this.subscribers = new Subscribers()
        this.bookshelf = new BookshelfReference(this.newBookshelfInstance())

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))
        this.setupViews()
        this.setupRibbon()
        this.setupCommands()

        this.processAllNotesOnceWorkspaceIsReady()
    }

    private setupViews(): void {
        this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this, this.bookshelf))
        this.registerView(VIEW_TYPE_STATISTICS, (leaf) => new StatisticsView(leaf, this, this.bookshelf))
    }

    private setupRibbon(): void {
        this.addRibbonIcon('library-big', 'Open Bookshelf library', () => this.activateView(VIEW_TYPE_LIBRARY))
        this.addRibbonIcon('chart-spline', 'Open Bookshelf statistics', () => this.activateView(VIEW_TYPE_STATISTICS))
    }

    private setupCommands(): void {
        this.addCommand({
            id: 'open-library',
            name: 'Open library',
            callback: () => this.activateView(VIEW_TYPE_LIBRARY),
        })

        this.addCommand({
            id: 'open-statistics',
            name: 'Open statistics',
            callback: () => this.activateView(VIEW_TYPE_STATISTICS),
        })

        this.addCommand({
            id: 'open-book-modal',
            name: 'Open book modal',
            checkCallback: (checking) => {
                const file = this.app.workspace.getActiveFile()

                if (!file) {
                    return false
                }

                const note = this.notes.noteByFile(file)

                if (checking) {
                    return this.bookshelf.has(note)
                }

                this.openBookModal(this.bookshelf.book(note))
            },
        })
    }

    public openBookModal(book: Book): void {
        new BookModal(this.app, this.bookshelf, book).open()
    }

    private newBookshelfInstance(): Bookshelf {
        return BookshelfFactory.fromConfiguration({
            settings: this.settings,
            dailyNotesSettings: this.dailyNotesSettings(),
            notes: this.notes,
            subscribers: this.subscribers,
            linkToUri: this.linkToUri.bind(this),
        })
    }

    private processAllNotesOnceWorkspaceIsReady(): void {
        if (this.app.workspace.layoutReady) {
            this.initialNoteProcessing()
        } else {
            this.app.workspace.onLayoutReady(() => this.initialNoteProcessing())
        }
    }

    private async initialNoteProcessing(): Promise<void> {
        await this.processAllNotes()

        this.registerEvent(this.app.metadataCache.on('resolve', async (file) => await this.handleFile(file)))
        this.registerEvent(this.app.metadataCache.on('changed', async (file) => await this.handleFile(file)))
        this.registerEvent(this.app.vault.on('rename', (file: TFile) => this.handleFile(file)))
        this.registerEvent(this.app.vault.on('delete', (file: TFile) => this.handleDelete(file)))
    }

    private async processAllNotes(): Promise<void> {
        await Promise.all(this.app.vault.getMarkdownFiles().map((file) => this.handleFile(file)))
    }

    public dailyNotesSettings(): DailyNotesSettings {
        // @ts-expect-error internalPlugins is not exposed
        const plugin = this.app.internalPlugins.getEnabledPluginById('daily-notes')
        if (plugin === null) {
            return { enabled: false, format: '', folder: null }
        }

        return { enabled: true, format: plugin.options.format || 'YYYY-MM-DD', folder: plugin.options.folder || null }
    }

    private async handleFile(file: TFile): Promise<void> {
        await this.bookshelf.process(this.notes.noteByFile(file))
    }

    private async handleDelete(file: TFile): Promise<void> {
        this.bookshelf.remove(this.notes.noteByFile(file))
    }

    private linkToUri(link: string): string {
        const coverFile = this.app.metadataCache.getFirstLinkpathDest(link, '')

        if (coverFile === null) {
            return ''
        }

        return this.app.vault.getResourcePath(coverFile)
    }

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
        this.settings = assign(DEFAULT_SETTINGS, migratedSettings(await this.loadData()) as BookshelfPluginSettings)
    }

    async saveSettings() {
        await this.saveData(this.settings)

        this.recreateBookshelf()
    }

    private recreateBookshelf = debounce({ delay: 500 }, async () => {
        this.bookshelf.replaceInstance(this.newBookshelfInstance())
        await this.processAllNotes()
    })
}
