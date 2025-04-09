import { Note } from '../bookshelf/note/note'
import { Metadata } from '../bookshelf/note/metadata'

export class FakeNote implements Note {
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

    public async *listItems(): AsyncGenerator<string> {
        for (const listItem of this.list) {
            yield listItem
        }
    }

    public async appendToList(sectionHeading: string, item: string): Promise<void> {
        this.list.push(item)
    }
}
