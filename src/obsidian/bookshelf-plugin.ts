import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { ObsidianMetadata } from '../metadata/metadata'
import { BookFactory } from '../book-factory'

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    private bookFactory: BookFactory

    private libraryView: LibraryView

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf()
        this.bookFactory = new BookFactory(this.settings.bookProperties, this.linkToUri.bind(this))

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
        if (!this.isBookNote(file)) {
            return
        }

        const identifier = file.path

        if (!this.bookshelf.has(identifier)) {
            const metadata = new ObsidianMetadata(this.app.metadataCache.getFileCache(file) || {})

            this.bookshelf.add(identifier, this.bookFactory.create(file.basename, metadata))
        }

        this.updateView()
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

    private updateView = debounce({ delay: 100 }, () => this.libraryView.update())

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
