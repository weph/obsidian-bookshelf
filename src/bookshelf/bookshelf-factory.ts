import { BookshelfPluginSettings } from '../obsidian/settings/bookshelf-plugin-settings'
import { Bookshelf } from './bookshelf'
import { bookNotePatterns } from './note-processing/book-note/book-note-pattern'
import { dailyNotePatterns } from './note-processing/daily-note/daily-note-pattern'
import { BookMetadataFactory } from './book/book-metadata-factory'
import { DailyNotesSettings } from '../obsidian/bookshelf-plugin'
import { BookNoteProcessor } from './note-processing/book-note/book-note-processor'
import { DailyNoteProcessor } from './note-processing/daily-note/daily-note-processor'
import { NoteProcessorCollection } from './note-processing/note-processor-collection'
import { NoteProcessor } from './note-processing/note-processor'
import { Notes } from './note/notes'
import { BookNoteReadingJourneyWriter } from './note-processing/book-note/book-note-reading-journey-writer'
import { ReadingJourneyWriter } from './note-processing/reading-journey-writer'
import { DailyNoteReadingJourneyWriter } from './note-processing/daily-note/daily-note-reading-journey-writer'
import { BookshelfImpl } from './bookshelf-impl'
import { Subscribers } from './subscriber/subscribers'

export interface Configuration {
    settings: BookshelfPluginSettings
    dailyNotesSettings: DailyNotesSettings
    notes: Notes
    subscribers?: Subscribers

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
                    config.notes,
                ),
            )
        }

        return new BookshelfImpl(
            new BookMetadataFactory(settings.bookProperties, config.linkToUri),
            new NoteProcessorCollection(processors),
            this.readingJourneyWriter(config),
            config.subscribers || new Subscribers(),
        )
    }

    private static readingJourneyWriter(config: Configuration): ReadingJourneyWriter {
        const settings = config.settings

        if (settings.readingProgress.newEntryLocation === 'bookNote') {
            return new BookNoteReadingJourneyWriter(
                settings.bookNote.dateFormat,
                settings.bookNote.heading,
                settings.bookNote.patterns,
            )
        }

        return new DailyNoteReadingJourneyWriter(config.notes, settings.dailyNote.heading, settings.dailyNote.patterns)
    }
}
