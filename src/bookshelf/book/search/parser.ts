import { Expression } from './expression'
import { Match } from './expressions/match'
import {
    alt,
    amb,
    apply,
    buildLexer,
    expectEOF,
    expectSingleResult,
    list_sc,
    opt,
    rep_sc,
    seq,
    tok,
    Token,
} from 'typescript-parsec'
import { And } from './expressions/and'
import { MatchField } from './expressions/match-field'
import { MatchAll } from './expressions/match-all'
import { Contains } from './conditions/contains'
import { Equals } from './conditions/equals'
import { GreaterThan } from './conditions/greater-than'
import { GreaterEqual } from './conditions/greater-equal'
import { LessEqual } from './conditions/less-equal'
import { LessThan } from './conditions/less-than'
import { Condition } from './condition'

export type Parser = (input: string) => Expression

enum TokenKind {
    Space,
    Colon,
    Term,
    QuotedString,
    Quote,
    NonSpace,
    GreaterThan,
    GreaterEqual,
    LessThan,
    LessEqual,
    Equal,
}

enum Operator {
    Equal = '=',
    GreaterThan = '>',
    GreaterEqual = '>=',
    LessThan = '<',
    LessEqual = '<=',
}

export function parser(): Parser {
    const tokenizer = buildLexer([
        [true, /^\s+/g, TokenKind.Space],
        [true, /^:/g, TokenKind.Colon],
        [true, /^"/g, TokenKind.Quote],
        [true, new RegExp(`^${Operator.GreaterEqual}`, 'g'), TokenKind.GreaterEqual],
        [true, new RegExp(`^${Operator.LessEqual}`, 'g'), TokenKind.LessEqual],
        [true, new RegExp(`^${Operator.GreaterThan}`, 'g'), TokenKind.GreaterThan],
        [true, new RegExp(`^${Operator.LessThan}`, 'g'), TokenKind.LessThan],
        [true, new RegExp(`^${Operator.Equal}`, 'g'), TokenKind.Equal],
        [true, /^\w+/g, TokenKind.Term],
        [true, /^"([^"\\]|(\\)+.)*"/g, TokenKind.QuotedString],
        [true, /^[^\s:"]/g, TokenKind.NonSpace],
    ])

    const term = apply(
        rep_sc(
            alt(
                tok(TokenKind.Quote),
                tok(TokenKind.NonSpace),
                tok(TokenKind.Colon),
                tok(TokenKind.GreaterEqual),
                tok(TokenKind.GreaterThan),
                tok(TokenKind.LessEqual),
                tok(TokenKind.LessThan),
                tok(TokenKind.Equal),
                tok(TokenKind.Term),
                tok(TokenKind.QuotedString),
            ),
        ),
        (token) =>
            token
                .map((t) => t.text)
                .join('')
                .replace(/^"/, ''),
    )

    const quotedString = apply(tok(TokenKind.QuotedString), (token) => {
        return token.text.substring(1, token.text.length - 1).replace(/(\\)"/g, '"')
    })

    const fieldOperator = alt(
        tok(TokenKind.GreaterEqual),
        tok(TokenKind.LessEqual),
        tok(TokenKind.GreaterThan),
        tok(TokenKind.LessThan),
        tok(TokenKind.Equal),
    )

    function condition(operator: Token<TokenKind> | undefined, value: string): Condition {
        switch (operator?.text) {
            case Operator.Equal:
                return new Equals(value)
            case Operator.GreaterThan:
                return new GreaterThan(value)
            case Operator.GreaterEqual:
                return new GreaterEqual(value)
            case Operator.LessThan:
                return new LessThan(value)
            case Operator.LessEqual:
                return new LessEqual(value)
        }

        return new Contains(value)
    }

    const fieldExpression = apply(
        seq(tok(TokenKind.Term), tok(TokenKind.Colon), opt(fieldOperator), alt(quotedString, term)),
        (token) => new MatchField(token[0].text, condition(token[2], token[3])),
    )

    const containsExpression = apply(alt(quotedString, term), (token) => new Match(new Contains(token)))

    const parser = apply(list_sc(amb(alt(fieldExpression, containsExpression)), tok(TokenKind.Space)), (token) => {
        if (token.length === 1) {
            return token[0][0]
        }

        return new And(token.map((t) => t[0]))
    })

    return (input) => {
        if (input.trim() === '') {
            return new MatchAll()
        }

        return expectSingleResult(expectEOF(parser.parse(tokenizer.parse(input))))
    }
}
