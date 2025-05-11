import { Expression } from './expression'
import { Book } from '../book'

export class And implements Expression {
    constructor(private readonly expressions: Array<Expression>) {}

    matches(book: Book): boolean {
        return this.expressions.every((expr) => expr.matches(book))
    }
}
