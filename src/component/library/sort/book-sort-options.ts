import { Book } from '../../../bookshelf/book'

type BookCompareFunction = (a: Book, b: Book) => number

export class BookSortOptions {
    private sortTitles: Array<string> = []
    private compareFunctions = new Map<string, BookCompareFunction>()

    public add(title: string, compare: BookCompareFunction) {
        if (this.compareFunctions.has(title)) {
            throw new Error(`Sort option "${title}" already exists`)
        }

        this.sortTitles.push(title)
        this.compareFunctions.set(title, compare)
    }

    public titles(): Array<string> {
        return this.sortTitles
    }

    public compareFunction(title: string): BookCompareFunction {
        const result = this.compareFunctions.get(title)

        if (result === undefined) {
            throw new Error(`Sort option "${title}" does not exist`)
        }

        return result
    }
}
