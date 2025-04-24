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
import { MouseEvent } from 'react'
import { appHasDailyNotesPluginLoaded, getDailyNoteSettings } from 'obsidian-daily-notes-interface'
import { BookshelfDummy } from '../bookshelf/bookshelf-dummy'
import { ReleaseNotesModal } from './modal/release-notes-modal'
import { Version } from './modal/version'

export interface DailyNotesSettings {
    enabled: boolean
    format: string
    folder: string | null
}

export default class BookshelfPlugin extends Plugin {
    public readonly version = Version.fromString('__bookshelf_plugin_version__')
    public settings: BookshelfPluginSettings

    private notes: ObsidianNotes

    private subscribers: Subscribers

    private bookshelf: BookshelfReference

    async onload() {
        await this.loadSettings()

        this.notes = new ObsidianNotes(this.app)
        this.subscribers = new Subscribers()
        this.bookshelf = new BookshelfReference(new BookshelfDummy(this.subscribers))

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))
        this.setupViews()
        this.setupRibbon()
        this.setupCommands()

        this.processAllNotesOnceWorkspaceIsReady()
        this.showReleaseNotes()
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

    public async handleBookClick(book: Book, event: MouseEvent): Promise<void> {
        const isMac = window.navigator.userAgent.toLowerCase().includes('mac')
        const modifierPressed = (isMac && event.metaKey) || (!isMac && event.ctrlKey)

        if (modifierPressed) {
            return this.openBookNote(book)
        }

        this.openBookModal(book)
    }

    public openBookModal(book: Book): void {
        new BookModal(this.app, this, this.bookshelf, book).open()
    }

    public async openBookNote(book: Book): Promise<void> {
        await this.app.workspace.openLinkText(book.note.basename, '')
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
        this.bookshelf.replaceInstance(this.newBookshelfInstance())

        await this.processAllNotes()

        this.registerEvent(this.app.metadataCache.on('resolve', async (file) => await this.handleFile(file)))
        this.registerEvent(this.app.metadataCache.on('changed', async (file) => await this.handleFile(file)))
        this.registerEvent(this.app.vault.on('rename', (file: TFile) => this.handleFile(file)))
        this.registerEvent(this.app.vault.on('delete', (file: TFile) => this.handleDelete(file)))
    }

    private async processAllNotes(): Promise<void> {
        await Promise.all(this.app.vault.getMarkdownFiles().map((file) => this.handleFile(file)))
    }

    private showReleaseNotes(): void {
        const previousVersion = Version.fromString(this.settings.previousVersion || '0.0.0')

        if (this.settings.showReleaseNotes && this.version.greaterThan(previousVersion)) {
            this.app.workspace.onLayoutReady(() => new ReleaseNotesModal(this.app, this).open())
        }
    }

    public dailyNotesSettings(): DailyNotesSettings {
        if (!appHasDailyNotesPluginLoaded()) {
            return { enabled: false, format: '', folder: null }
        }

        const settings = getDailyNoteSettings()

        return {
            enabled: true,
            format: settings.format || 'YYYY-MM-DD',
            folder: settings.folder || null,
        }
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
