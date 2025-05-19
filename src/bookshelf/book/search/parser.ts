import { Expression } from './expression'
import { Contains } from './expressions/contains'
import {
    alt,
    amb,
    apply,
    buildLexer,
    expectEOF,
    expectSingleResult,
    list_sc,
    rep_sc,
    seq,
    tok,
} from 'typescript-parsec'
import { And } from './expressions/and'
import { FieldFilter } from './expressions/field-filter'
import { MatchAll } from './expressions/match-all'

export type Parser = (input: string) => Expression

enum TokenKind {
    Space,
    Colon,
    Term,
    QuotedString,
    Quote,
    NonSpace,
}

export function parser(): Parser {
    const tokenizer = buildLexer([
        [true, /^\s+/g, TokenKind.Space],
        [true, /^:/g, TokenKind.Colon],
        [true, /^"/g, TokenKind.Quote],
        [true, /^\w+/g, TokenKind.Term],
        [true, /^"([^"\\]|(\\)+.)*"/g, TokenKind.QuotedString],
        [true, /^[^\s:"]/g, TokenKind.NonSpace],
    ])

    const quotedString = apply(tok(TokenKind.QuotedString), (token) => {
        return token.text.substring(1, token.text.length - 1).replace(/(\\)"/g, '"')
    })

    const fieldExpression = apply(
        seq(tok(TokenKind.Term), tok(TokenKind.Colon), quotedString),
        (token) => new FieldFilter(token[0].text, token[2]),
    )

    const quotedExpression = apply(quotedString, (str) => new Contains(str))

    const containsExpression = apply(
        rep_sc(
            alt(
                tok(TokenKind.Quote),
                tok(TokenKind.NonSpace),
                tok(TokenKind.Colon),
                tok(TokenKind.Term),
                tok(TokenKind.QuotedString),
            ),
        ),
        (token) =>
            new Contains(
                token
                    .map((t) => t.text)
                    .join('')
                    .trim()
                    .replace(/^"/, ''),
            ),
    )

    const parser = apply(
        list_sc(amb(alt(fieldExpression, quotedExpression, containsExpression)), tok(TokenKind.Space)),
        (token) => {
            if (token.length === 1) {
                return token[0][0]
            }

            return new And(token.map((t) => t[0]))
        },
    )

    return (input) => {
        if (input.trim() === '') {
            return new MatchAll()
        }

        return expectSingleResult(expectEOF(parser.parse(tokenizer.parse(input))))
    }
}
