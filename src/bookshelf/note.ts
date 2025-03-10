import { Metadata } from './metadata/metadata'

export interface Note {
    readonly identifier: string
    readonly path: string
    readonly basename: string
    readonly metadata: Metadata
    listItems: (sectionHeading: string) => AsyncGenerator<string>
}
