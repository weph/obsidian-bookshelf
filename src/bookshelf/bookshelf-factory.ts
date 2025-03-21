import { BookshelfPluginSettings } from '../obsidian/settings/bookshelf-plugin-settings'
import { Bookshelf } from './bookshelf'
import { bookNotePatterns } from './reading-journey/pattern/book-note/book-note-pattern'
import { dailyNotePatterns } from './reading-journey/pattern/daily-note/daily-note-pattern'
import { BookMetadataFactory } from './metadata/book-metadata-factory'
import { DailyNotesSettings } from '../obsidian/bookshelf-plugin'

interface Configuration {
    settings: BookshelfPluginSettings
    dailyNotesSettings: DailyNotesSettings

    bookIdentifier(input: string): string | null

    linkToUri(link: string): string
}

export class BookshelfFactory {
    public static fromConfiguration(config: Configuration): Bookshelf {
        const settings = config.settings
        const bnResult = bookNotePatterns(settings.bookNote.patterns, settings.bookNote.dateFormat)
        const dnResult = dailyNotePatterns(settings.dailyNote.patterns)

        return new Bookshelf(
            settings.booksFolder,
            {
                format: config.dailyNotesSettings.format,
                folder: config.dailyNotesSettings.folder || '',
                heading: settings.dailyNote.heading,
            },
            { heading: settings.bookNote.heading },
            new BookMetadataFactory(settings.bookProperties, config.linkToUri),
            bnResult.patterns,
            dnResult.patterns,
            config.bookIdentifier,
        )
    }
}
