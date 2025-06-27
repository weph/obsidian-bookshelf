import { Metadata } from './metadata'

export interface Note {
    readonly path: string
    readonly basename: string
    readonly metadata: Metadata
    readonly heading: string | null
    content: () => Promise<string>
    listItems: (sectionHeading: string) => Promise<Array<string>>
    appendToList: (sectionHeading: string, items: Array<string>) => Promise<void>
}
