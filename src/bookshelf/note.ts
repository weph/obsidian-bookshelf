import { Metadata } from './metadata/metadata'

export interface Note {
    readonly path: string
    readonly basename: string
    readonly metadata: Metadata
    content: () => Promise<string>
    listItems: (sectionHeading: string) => AsyncGenerator<string>
}
