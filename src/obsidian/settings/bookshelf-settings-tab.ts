import { App, PluginSettingTab, Setting } from 'obsidian'
import BookshelfPlugin from '../bookshelf-plugin'

export class BookshelfSettingsTab extends PluginSettingTab {
    plugin: BookshelfPlugin

    constructor(app: App, plugin: BookshelfPlugin) {
        super(app, plugin)

        this.plugin = plugin
    }

    display(): void {
        this.containerEl.empty()

        this.addBooksSettings()
        this.addBookProperties()
        this.addBookNoteSettings()
        this.addDailyNoteSettings()
    }

    private addBooksSettings(): void {
        const { containerEl } = this

        new Setting(containerEl)
            .setName('Books Folder')
            .setDesc('Folder where your books are stored')
            .addText((text) =>
                text.setValue(this.plugin.settings.booksFolder).onChange(async (value) => {
                    this.plugin.settings.booksFolder = value

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBookProperties(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Book Note Properties').setHeading()

        new Setting(containerEl)
            .setName('Cover')
            .setDesc("Name of the property that holds the book's cover link, filename or URL")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.cover).onChange(async (value) => {
                    this.plugin.settings.bookProperties.cover = value

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Author')
            .setDesc("Name of the property that holds the author's name(s)")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.author).onChange(async (value) => {
                    this.plugin.settings.bookProperties.author = value

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Published')
            .setDesc("Name of the property that holds the book's publishing date")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.published).onChange(async (value) => {
                    this.plugin.settings.bookProperties.published = value

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBookNoteSettings(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Book Note Patterns').setHeading()

        const dateFormat = new Setting(containerEl).setName('Date Format')
        dateFormat.addText((textArea) => {
            textArea.setValue(this.plugin.settings.bookNote.dateFormat).onChange(async (value) => {
                this.plugin.settings.bookNote.dateFormat = value

                await this.plugin.saveSettings()
            })

            textArea.inputEl.style.width = '100%'
        })

        new Setting(containerEl)
            .setName('Progress Patterns')
            .setDesc('{date}, {book}, {startPage}, {endPage}, {*}')
            .addTextArea((textArea) => {
                textArea
                    .setValue(this.plugin.settings.bookNote.patterns.progress.join('\n'))
                    .onChange(async (value) => {
                        this.plugin.settings.bookNote.patterns.progress = value.split('\n').filter((x) => x)

                        await this.plugin.saveSettings()
                    })

                textArea.inputEl.style.width = '100%'
                textArea.inputEl.rows = 4
            })
    }

    private addDailyNoteSettings(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Daily Note Patterns').setHeading()

        new Setting(containerEl)
            .setName('Progress Patterns')
            .setDesc('{book}, {startPage}, {endPage}, {*}')
            .addTextArea((textArea) => {
                textArea
                    .setValue(this.plugin.settings.dailyNote.patterns.progress.join('\n'))
                    .onChange(async (value) => {
                        this.plugin.settings.dailyNote.patterns.progress = value.split('\n').filter((x) => x)

                        await this.plugin.saveSettings()
                    })

                textArea.inputEl.style.width = '100%'
                textArea.inputEl.rows = 4
            })
    }
}
