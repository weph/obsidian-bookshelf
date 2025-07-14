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

    override async onClose(): Promise<void> {
        await this.bookshelfPlugin.loadSettings()
        this.bookshelfPlugin.settings.previousVersion = this.bookshelfPlugin.version.asString()
        await this.bookshelfPlugin.saveSettings()
    }

    override async onOpen(): Promise<void> {
        const previousVersion = Version.fromString(this.bookshelfPlugin.settings.previousVersion || '0.0.0')

        const items = this.releaseNotes(previousVersion)

        this.contentEl.className = styles.releaseNotesModal
        await MarkdownRenderer.render(this.app, items.join('\n\n'), this.contentEl, '', this.bookshelfPlugin)
    }

    private releaseNotes(previousVersion: Version): Array<string> {
        if (previousVersion.asString() === '0.0.0') {
            return [
                `
Thanks for giving Bookshelf a try!
 
This dialog will show you what's new whenever Bookshelf gets updated. If you'd rather not see it in the future, you can disable release notes in the plugin settings.

Make sure to check out the [documentation](https://weph.github.io/obsidian-bookshelf/). I've done my best to explain how everything works. If you run into any issues or have ideas for new features, feel free to open an issue or start a discussion on [GitHub](https://github.com/weph/obsidian-bookshelf).
                `,
            ]
        }

        return Object.entries(releaseNotes)
            .filter((entry) => Version.fromString(entry[0]).greaterThan(previousVersion))
            .map((entry) => `## ${entry[0]}\n\n${entry[1]}`)
    }
}
