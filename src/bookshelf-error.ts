export class BookshelfError extends Error {
    static identifierDoesntExist(identifier: string) {
        return new BookshelfError(`A book with the identifier "${identifier}" does not exist`)
    }

    static identifierExists(identifier: string) {
        return new BookshelfError(`A book with the identifier "${identifier}" already exists`)
    }
}
