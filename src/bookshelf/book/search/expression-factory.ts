import { Parser } from './parser'
import { Expression } from './expression'
import { Query } from '../books'
import { MatchField } from './expressions/match-field'
import { And } from './expressions/and'

export class ExpressionFactory {
    constructor(private readonly parsedExpression: Parser) {}

    public fromString(input: string): Expression {
        return this.parsedExpression(input)
    }

    public fromQuery(query: Query): Expression {
        const expressions = [this.fromString(query.search)]

        if (query.list !== null) {
            expressions.push(new MatchField('list', query.list))
        }

        if (query.status !== null) {
            expressions.push(new MatchField('status', query.status))
        }

        if (expressions.length === 1) {
            return expressions[0]
        }

        return new And(expressions)
    }
}
