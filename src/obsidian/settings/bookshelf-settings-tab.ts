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

        this.addSectionHeadline(this.containerEl, 'Book')
        this.addBooksSettings()
        this.addBookProperties()

        this.addSectionHeadline(this.containerEl, 'Reading progress')
        this.addBookNoteSettings()
        this.addDailyNoteSettings()
    }

    private addBooksSettings(): void {
        const { containerEl } = this

        new Setting(containerEl)
            .setName('Books folder')
            .setDesc('Folder where your books are stored')
            .addText((text) =>
                text.setValue(this.plugin.settings.booksFolder).onChange(async (value) => {
                    this.plugin.settings.booksFolder = value

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addSectionHeadline(container: HTMLElement, headline: string): void {
        const element = document.createElement('h3')
        element.innerText = headline

        container.append(element)
    }

    private addBookProperties(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Book note properties').setHeading()

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

        new Setting(containerEl)
            .setName('Rating')
            .setDesc("Name of the property that holds the book's rating")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.rating).onChange(async (value) => {
                    this.plugin.settings.bookProperties.rating = value

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBookNoteSettings(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Book note patterns').setHeading()

        const dateFormat = new Setting(containerEl).setName('Date format')
        dateFormat.addText((textArea) => {
            textArea.setValue(this.plugin.settings.bookNote.dateFormat).onChange(async (value) => {
                this.plugin.settings.bookNote.dateFormat = value

                await this.plugin.saveSettings()
            })

            textArea.inputEl.className = 'bookshelf--settings--full-width'
        })

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('{date}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.started = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('{date}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.abandoned = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('{date}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.finished = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('{date}, {startPage}, {endPage}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.absoluteProgress = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('{date}, {endPage}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.relativeProgress = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })
    }

    private addDailyNoteSettings(): void {
        const { containerEl } = this

        new Setting(containerEl).setName('Daily note patterns').setHeading()

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('{book}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.started = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('{book}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.abandoned = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('{book}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.finished = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('{book}, {startPage}, {endPage}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.absoluteProgress = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('{book}, {endPage}, {*}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.relativeProgress = value

                    await this.plugin.saveSettings()
                })

                field.inputEl.className = 'bookshelf--settings--full-width'
            })
    }
}
