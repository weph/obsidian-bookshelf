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
import { NoteProcessor } from './note-processing/note-processor'

export interface Configuration {
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

        const processors: Array<NoteProcessor> = [
            new BookNoteProcessor(
                settings.booksFolder,
                settings.bookNote.heading,
                settings.bookNote.enabled ? bnResult.patterns : null,
            ),
        ]

        if (config.dailyNotesSettings.enabled && settings.dailyNote.enabled) {
            processors.push(
                new DailyNoteProcessor(
                    settings.dailyNote.heading,
                    config.dailyNotesSettings.format,
                    config.dailyNotesSettings.folder || '',
                    dnResult.patterns,
                    config.noteForLink,
                ),
            )
        }

        return new Bookshelf(
            new BookMetadataFactory(settings.bookProperties, config.linkToUri),
            new NoteProcessorCollection(processors),
        )
    }
}
