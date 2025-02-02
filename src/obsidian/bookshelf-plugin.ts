import { Plugin, TFile } from 'obsidian'
import { Bookshelf } from '../bookshelf'
import { LibraryView, VIEW_TYPE_LIBRARY } from './view/library-view'
import { Book } from '../book'
import { debounce } from 'radashi'

export default class BookshelfPlugin extends Plugin {
    private bookshelf: Bookshelf

    private libraryView: LibraryView

    async onload() {
        this.bookshelf = new Bookshelf()

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
        const identifier = file.path

        if (!this.bookshelf.has(identifier)) {
            this.bookshelf.add(identifier, new Book(file.basename))
        }

        this.updateView()
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
}
