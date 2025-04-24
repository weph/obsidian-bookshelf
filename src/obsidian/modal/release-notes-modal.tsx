import { App, MarkdownRenderer, Modal } from 'obsidian'
import BookshelfPlugin from '../bookshelf-plugin'
import { releaseNotes } from './release-notes'
import { Version } from './version'
import styles from './release-notes-modal.module.scss'

export class ReleaseNotesModal extends Modal {
    constructor(
        app: App,
        private readonly bookshelfPlugin: BookshelfPlugin,
    ) {
        super(app)

        this.setTitle('Bookshelf release notes')
    }

    async onClose(): Promise<void> {
        await this.bookshelfPlugin.loadSettings()
        this.bookshelfPlugin.settings.previousVersion = this.bookshelfPlugin.version.asString()
        await this.bookshelfPlugin.saveSettings()
    }

    async onOpen(): Promise<void> {
        const previousVersion = Version.fromString(this.bookshelfPlugin.settings.previousVersion || '0.0.0')

        const items = Object.entries(releaseNotes)
            .filter((entry) => Version.fromString(entry[0]).greaterThan(previousVersion))
            .map((entry) => `## ${entry[0]}\n\n${entry[1]}`)

        this.contentEl.className = styles.releaseNotesModal
        await MarkdownRenderer.render(this.app, items.join('\n\n'), this.contentEl, '', this.bookshelfPlugin)
    }
}
