import { BookshelfPluginSettings } from '../obsidian/settings/bookshelf-plugin-settings'
import { Bookshelf } from './bookshelf'
import { bookNotePatterns } from './reading-journey/pattern/book-note/book-note-pattern'
import { dailyNotePatterns } from './reading-journey/pattern/daily-note/daily-note-pattern'
import { BookMetadataFactory } from './metadata/book-metadata-factory'
import { DailyNotesSettings } from '../obsidian/bookshelf-plugin'
import { Note } from './note'
import { BookNoteProcessor } from './note-processing/book-note-processor'
import { DailyNoteProcessor } from './note-processing/daily-note-processor'
import { NoteProcessorCollection } from './note-processing/note-processor-collection'

interface Configuration {
    settings: BookshelfPluginSettings
    dailyNotesSettings: DailyNotesSettings

    noteForLink(input: string): Note | null

    linkToUri(link: string): string
}

export class BookshelfFactory {
    public static fromConfiguration(config: Configuration): Bookshelf {
        const settings = config.settings
        const bnResult = bookNotePatterns(settings.bookNote.patterns, settings.bookNote.dateFormat)
        const dnResult = dailyNotePatterns(settings.dailyNote.patterns)

        return new Bookshelf(
            new BookMetadataFactory(settings.bookProperties, config.linkToUri),
            new NoteProcessorCollection([
                new BookNoteProcessor(settings.booksFolder, settings.bookNote.heading, bnResult.patterns),
                new DailyNoteProcessor(
                    settings.dailyNote.heading,
                    config.dailyNotesSettings.format,
                    config.dailyNotesSettings.folder || '',
                    dnResult.patterns,
                    config.noteForLink,
                ),
            ]),
        )
    }
}
