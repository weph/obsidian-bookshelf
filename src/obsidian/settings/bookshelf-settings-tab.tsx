import { App, PluginSettingTab, Setting } from 'obsidian'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { DateFormatDescription } from '../../component/date-format-description/date-format-description'
import { flushSync } from 'react-dom'

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
        this.addDailyNotesSection()
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

        const fragment = document.createDocumentFragment()

        let root: Root
        flushSync(() => {
            root = createRoot(fragment)
            this.renderDateFormatDescription(root)
        })

        new Setting(containerEl)
            .setName('Heading')
            .setDesc('The heading that marks the start of reading progress entries')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.heading).onChange(async (value) => {
                    this.plugin.settings.bookNote.heading = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Date format')
            .setDesc(fragment)
            .addText((textArea) => {
                textArea.setValue(this.plugin.settings.bookNote.dateFormat).onChange(async (value) => {
                    this.plugin.settings.bookNote.dateFormat = value

                    this.renderDateFormatDescription(root)

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.started = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.abandoned = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.finished = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('Supported tokens: {date}, {startPage}, {endPage}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.absoluteProgress = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('Supported tokens: {date}, {endPage}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.relativeProgress = value

                    await this.plugin.saveSettings()
                })
            })
    }

    private addDailyNotesSection(): void {
        const { containerEl } = this

        const dailyNotesEnabled = this.plugin.dailyNotesSettings().enabled
        const showSettings = dailyNotesEnabled && this.plugin.settings.dailyNote.enabled

        const heading = new Setting(containerEl).setName('Daily note patterns').setHeading()

        const settingsContainer = containerEl.createEl('div')

        heading.addToggle((toggle) => {
            if (!dailyNotesEnabled) {
                toggle.setDisabled(true)
                toggle.setTooltip('Daily notes plugin is disabled')
            }

            toggle.setValue(showSettings)
            toggle.onChange(async (value) => {
                this.plugin.settings.dailyNote.enabled = value

                if (value) {
                    this.addDailyNotesSettings(settingsContainer)
                } else {
                    settingsContainer.empty()
                }

                await this.plugin.saveSettings()
            })
        })

        if (showSettings) {
            this.addDailyNotesSettings(settingsContainer)
        }
    }

    private addDailyNotesSettings(containerEl: HTMLElement): void {
        new Setting(containerEl)
            .setName('Heading')
            .setDesc('The heading that marks the start of reading progress entries')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.heading).onChange(async (value) => {
                    this.plugin.settings.dailyNote.heading = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.started = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.abandoned = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.finished = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('Supported tokens: {book}, {startPage}, {endPage}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.absoluteProgress = value

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('Supported tokens: {book}, {endPage}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.relativeProgress = value

                    await this.plugin.saveSettings()
                })
            })
    }

    private renderDateFormatDescription(root: Root): void {
        root.render(
            <StrictMode>
                <DateFormatDescription format={this.plugin.settings.bookNote.dateFormat} />
            </StrictMode>,
        )
    }
}
