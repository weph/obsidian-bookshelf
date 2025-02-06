export interface BookMetadata {
    readonly title: string
    readonly cover?: string
    readonly authors?: Array<string>
    readonly published?: Date
}

export interface Book {
    metadata: BookMetadata
}
