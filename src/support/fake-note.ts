import { Note } from '../bookshelf/note/note'
import { Metadata } from '../bookshelf/note/metadata'

export class FakeNote implements Note {
    public heading: string | null = null

    constructor(
        public path: string,
        public metadata: Metadata,
        public list: Array<string> = [],
    ) {}

    get identifier(): string {
        return this.path
    }

    get basename(): string {
        return this.path.replace(/.*?\/?([^/]+)\.md/, '$1')
    }

    public async content(): Promise<string> {
        return ''
    }

    public async listItems(): Promise<Array<string>> {
        return this.list
    }

    public async appendToList(_sectionHeading: string, items: Array<string>): Promise<void> {
        this.list.push(...items)
    }
}
