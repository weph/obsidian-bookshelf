import { Metadata } from './metadata'

export interface Note {
    readonly path: string
    readonly basename: string
    readonly metadata: Metadata
    readonly heading: string | null
    content: () => Promise<string>
    listItems: (sectionHeading: string) => AsyncGenerator<string>
    appendToList: (sectionHeading: string, item: string) => Promise<void>
}
