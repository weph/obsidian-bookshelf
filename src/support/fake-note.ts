import { Note } from '../bookshelf/note'
import { Metadata } from '../bookshelf/metadata/metadata'

export class FakeNote implements Note {
    constructor(
        public readonly path: string,
        public readonly metadata: Metadata,
        public readonly list: Array<string>,
    ) {}

    get identifier(): string {
        return this.path
    }

    get basename(): string {
        return this.path.replace(/.*?\/?([^/]+)\.md/, '$1')
    }

    public async *listItems(): AsyncGenerator<string> {
        for (const listItem of this.list) {
            yield listItem
        }
    }
}
