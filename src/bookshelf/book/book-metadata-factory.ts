import { BookMetadata } from './book'
import { Note } from '../note/note'
import { BookMetadataNoteAdapter, LinkToUri, PropertyNames } from './book-metadata-note-adapter'

export class BookMetadataFactory {
    constructor(
        private propertyNames: PropertyNames,
        private linkToUri: LinkToUri,
    ) {}

    public create(note: Note): BookMetadata {
        return new BookMetadataNoteAdapter(note, this.propertyNames, this.linkToUri)
    }
}
