import { App, PluginSettingTab, Setting } from 'obsidian'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { DateFormatDescription } from '../../component/date-format-description/date-format-description'
import { flushSync } from 'react-dom'
import { BOOK_NOTE, DAILY_NOTE, NoteType } from './bookshelf-plugin-settings'

export class BookshelfSettingsTab extends PluginSettingTab {
    plugin: BookshelfPlugin

    constructor(app: App, plugin: BookshelfPlugin) {
        super(app, plugin)

        this.plugin = plugin
    }

    display(): void {
        this.containerEl.empty()

        this.addGeneralSettings()

        this.addBooksSettings()
        this.addBookProperties()

        this.addReadingProgressSection()
        this.addBookNoteSection()
        this.addDailyNotesSection()
    }

    private addGeneralSettings(): void {
        const { containerEl } = this

        new Setting(containerEl)
            .setName('Release notes')
            .setDesc('Display release notes after updating to a new version')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.showReleaseNotes).onChange(async (value) => {
                    this.plugin.settings.showReleaseNotes = value

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBooksSettings(): void {
        const { containerEl } = this

        new Setting(containerEl)
            .setName('Books folder')
            .setDesc('Folder where your books are stored')
            .addText((text) =>
                text.setValue(this.plugin.settings.booksFolder).onChange(async (value) => {
                    this.plugin.settings.booksFolder = value.trim()

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
                    this.plugin.settings.bookProperties.cover = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Author')
            .setDesc("Name of the property that holds the author's name(s)")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.author).onChange(async (value) => {
                    this.plugin.settings.bookProperties.author = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Published')
            .setDesc("Name of the property that holds the book's publishing date")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.published).onChange(async (value) => {
                    this.plugin.settings.bookProperties.published = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Pages')
            .setDesc("Name of the property that holds the book's number of pages")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.pages).onChange(async (value) => {
                    this.plugin.settings.bookProperties.pages = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Rating')
            .setDesc("Name of the property that holds the book's rating")
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.rating).onChange(async (value) => {
                    this.plugin.settings.bookProperties.rating = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Lists')
            .setDesc('Name of the property that contains the lists a book is on')
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.lists).onChange(async (value) => {
                    this.plugin.settings.bookProperties.lists = value.trim()

                    await this.plugin.saveSettings()
                }),
            )

        new Setting(containerEl)
            .setName('Comment')
            .setDesc('Name of the property that contains your personal comment about the book')
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties.comment).onChange(async (value) => {
                    this.plugin.settings.bookProperties.comment = value.trim()

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBookNoteSection(): void {
        const { containerEl } = this

        const showSettings = this.plugin.settings.bookNote.enabled

        const heading = new Setting(containerEl).setName('Book note patterns').setHeading()

        const settingsContainer = containerEl.createEl('div')

        heading.addToggle((toggle) => {
            toggle.setValue(showSettings)
            toggle.onChange(async (value) => {
                this.plugin.settings.bookNote.enabled = value

                if (value) {
                    this.addBookNoteSettings(settingsContainer)
                } else {
                    settingsContainer.empty()
                }

                await this.plugin.saveSettings()
            })
        })

        if (showSettings) {
            this.addBookNoteSettings(settingsContainer)
        }
    }

    private addBookNoteSettings(containerEl: HTMLElement): void {
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
                    this.plugin.settings.bookNote.heading = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Date format')
            .setDesc(fragment)
            .addText((textArea) => {
                textArea.setValue(this.plugin.settings.bookNote.dateFormat).onChange(async (value) => {
                    this.plugin.settings.bookNote.dateFormat = value.trim()

                    this.renderDateFormatDescription(root)

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.started = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.abandoned = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('Supported tokens: {date}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.finished = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('Supported tokens: {date}, {start}, {end}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.absoluteProgress = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('Supported tokens: {date}, {end}')
            .addText((field) => {
                field.setValue(this.plugin.settings.bookNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.bookNote.patterns.relativeProgress = value.trim()

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
                    this.plugin.settings.dailyNote.heading = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Started book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.started).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.started = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Abandoned book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.abandoned).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.abandoned = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Finished book')
            .setDesc('Supported tokens: {book}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.finished).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.finished = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (absolute)')
            .setDesc('Supported tokens: {book}, {start}, {end}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.absoluteProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.absoluteProgress = value.trim()

                    await this.plugin.saveSettings()
                })
            })

        new Setting(containerEl)
            .setName('Reading progress (relative)')
            .setDesc('Supported tokens: {book}, {end}')
            .addText((field) => {
                field.setValue(this.plugin.settings.dailyNote.patterns.relativeProgress).onChange(async (value) => {
                    this.plugin.settings.dailyNote.patterns.relativeProgress = value.trim()

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

    private addReadingProgressSection(): void {
        new Setting(this.containerEl).setName('Reading progress').setHeading()

        const options: Record<string, string> = {
            [BOOK_NOTE]: 'Book note',
        }

        if (this.plugin.dailyNotesSettings().enabled) {
            options[DAILY_NOTE] = 'Daily note'
        }

        new Setting(this.containerEl)
            .setName('Entry location')
            .setDesc('Location for new reading progress entries')
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions(options)
                    .setValue(this.plugin.settings.readingProgress.newEntryLocation)
                    .onChange(async (value) => {
                        this.plugin.settings.readingProgress.newEntryLocation = value as NoteType

                        await this.plugin.saveSettings()
                    }),
            )
    }
}
