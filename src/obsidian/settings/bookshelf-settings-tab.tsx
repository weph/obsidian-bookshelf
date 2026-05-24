import { App, PluginSettingTab, Setting } from 'obsidian'
import BookshelfPlugin from '../bookshelf-plugin'
import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import { DateFormatDescription } from '../../component/date-format-description/date-format-description'
import { flushSync } from 'react-dom'
import { BOOK_NOTE, BookshelfPluginSettings, DAILY_NOTE, NoteType } from './bookshelf-plugin-settings'

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

        this.addBookPropertySetting('title', 'Title', 'Property name for the book title')
        this.addBookPropertySetting('cover', 'Cover', 'Property name for the cover (link, filename, or URL)')
        this.addBookPropertySetting('author', 'Author', 'Property name for the author(s)')
        this.addBookPropertySetting('published', 'Published', 'Property name for the publishing date')
        this.addBookPropertySetting('pages', 'Pages', 'Property name for the page count')
        this.addBookPropertySetting('rating', 'Rating', 'Property name for the rating')
        this.addBookPropertySetting('lists', 'Lists', 'Property name for the reading lists the book belongs to')
        this.addBookPropertySetting('comment', 'Comment', 'Property name for your personal comment')
        this.addBookPropertySetting(
            'links',
            'Links',
            'Property name for external or internal links related to the book',
        )
        this.addBookPropertySetting('series', 'Series', 'Property name for the series name')
        this.addBookPropertySetting('genre', 'Genre', 'Property name for the genre(s)')
        this.addBookPropertySetting(
            'positionInSeries',
            'Position in series',
            "Property name for the book's position within its series",
        )
        this.addBookPropertySetting('duration', 'Audiobook duration', 'Property name for the total audiobook duration')
    }

    private addBookPropertySetting(
        property: keyof BookshelfPluginSettings['bookProperties'],
        name: string,
        description: string,
    ) {
        new Setting(this.containerEl)
            .setName(name)
            .setDesc(description)
            .addText((text) =>
                text.setValue(this.plugin.settings.bookProperties[property]).onChange(async (value) => {
                    this.plugin.settings.bookProperties[property] = value.trim()

                    await this.plugin.saveSettings()
                }),
            )
    }

    private addBookNoteSection(): void {
        const { containerEl } = this

        const showSettings = this.plugin.settings.bookNote.enabled

        const heading = new Setting(containerEl).setName('Book note patterns').setHeading()

        const settingsContainer = containerEl.createDiv()

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
        const fragment = activeDocument.createDocumentFragment()

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

        const settingsContainer = containerEl.createDiv()

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
