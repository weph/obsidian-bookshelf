import { Book } from '../book'

export interface Expression {
    matches(book: Book): boolean
}
