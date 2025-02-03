import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { Book } from '../book'
import { debounce } from 'radashi'
import { BookshelfPluginSettings, DEFAULT_SETTINGS } from './settings/bookshelf-plugin-settings'
import { BookshelfSettingsTab } from './settings/bookshelf-settings-tab'
import { ObsidianMetadata } from '../metadata/metadata'

export default class BookshelfPlugin extends Plugin {
    public settings: BookshelfPluginSettings

    private bookshelf: Bookshelf

    private libraryView: LibraryView

    async onload() {
        await this.loadSettings()

        this.bookshelf = new Bookshelf()

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
            this.bookshelf.add(identifier, new Book(file.basename, this.coverUrl(file)))
        }

        this.updateView()
    }

    private isBookNote(file: TFile): boolean {
        return this.settings.booksFolder !== '' && file.path.startsWith(this.settings.booksFolder)
    }

    private coverUrl(file: TFile): string {
        const coverProperty = this.settings.bookProperties.cover
        const resourcePath = this.app.vault.getResourcePath(file)
        const meta = new ObsidianMetadata(this.app.metadataCache.getFileCache(file) || {})

        const cover = meta.value(coverProperty)
        if (cover === null) {
            return ''
        }

        if (typeof cover === 'object' && 'link' in cover) {
            const coverFile = this.app.metadataCache.getFirstLinkpathDest(cover.link, '')
            if (coverFile === null) {
                return ''
            }

            return this.app.vault.getResourcePath(coverFile)
        }

        if (typeof cover === 'string' && cover.startsWith('http')) {
            return cover
        }

        const directory = file.parent
        if (directory === null) {
            return ''
        }

        return `${resourcePath.replace(/^(.+)\/[^/]*/, '$1')}/attachments/${cover}`
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
