import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { assign, debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { BookMetadataFactory } from '../book-metadata-factory'
import { StatisticsView, VIEW_TYPE_STATISTICS } from './view/statistics-view'
import { dailyNotePatterns } from '../reading-journey/pattern/daily-note/daily-note-pattern'
import { bookNotePatterns } from '../reading-journey/pattern/book-note/book-note-pattern'
import { ObsidianNote } from './obsidian-note'

export interface DailyNotesSettings {
    enabled: boolean
    format: string
    folder: string | null
}

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf(
            this.settings.booksFolder,
            this.dailyNotesSettings(),
            new BookMetadataFactory(this.settings.bookProperties, this.linkToUri.bind(this)),
            bookNotePatterns(this.settings.bookNote.patterns, this.settings.bookNote.dateFormat),
            dailyNotePatterns(this.settings.dailyNote.patterns),
            this.bookIdentifier.bind(this),
        )

        this.addSettingTab(new BookshelfSettingsTab(this.app, this))

        this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this.bookshelf))
        this.registerView(VIEW_TYPE_STATISTICS, (leaf) => new StatisticsView(leaf, this.bookshelf))

        this.addRibbonIcon('library-big', 'Bookshelf: Library', () => this.activateView(VIEW_TYPE_LIBRARY))
        this.addRibbonIcon('chart-spline', 'Bookshelf: Statistics', () => this.activateView(VIEW_TYPE_STATISTICS))

        this.app.metadataCache.on('resolve', async (file) => await this.handleFile(file))
        this.app.metadataCache.on('changed', async (file) => await this.handleFile(file))
    }

    private dailyNotesSettings(): DailyNotesSettings {
        // @ts-expect-error internalPlugins is not exposed
        const plugin = this.app.internalPlugins.getEnabledPluginById('daily-notes')
        if (plugin === null) {
            return { enabled: false, format: '', folder: null }
        }

        return { enabled: true, format: plugin.options.format || 'YYYY-MM-DD', folder: plugin.options.folder || null }
    }

    private async handleFile(file: TFile): Promise<void> {
        const note = new ObsidianNote(file, this.app)

        await this.bookshelf.process(note)
        this.updateView()
    }

    private bookIdentifier(input: string): string {
        const bookName = input.replace('[[', '').replace(']]', '')
        const bookFile = this.app.metadataCache.getFirstLinkpathDest(bookName, '')

        return bookFile === null ? bookName : bookFile.path
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
