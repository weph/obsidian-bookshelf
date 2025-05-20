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
    rep_sc,
    seq,
    tok,
} from 'typescript-parsec'
import { And } from './expressions/and'
import { MatchField } from './expressions/match-field'
import { MatchAll } from './expressions/match-all'
import { Contains } from './conditions/contains'

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

    const term = apply(
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
            token
                .map((t) => t.text)
                .join('')
                .trim()
                .replace(/^"/, ''),
    )

    const quotedString = apply(tok(TokenKind.QuotedString), (token) => {
        return token.text.substring(1, token.text.length - 1).replace(/(\\)"/g, '"')
    })

    const fieldExpression = apply(
        seq(tok(TokenKind.Term), tok(TokenKind.Colon), alt(quotedString, term)),
        (token) => new MatchField(token[0].text, new Contains(token[2])),
    )

    const quotedExpression = apply(quotedString, (str) => new Match(new Contains(str)))

    const containsExpression = apply(term, (token) => new Match(new Contains(token)))

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
