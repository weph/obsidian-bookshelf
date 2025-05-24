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
    str,
    tok,
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
}

export function parser(): Parser {
    const tokenizer = buildLexer([
        [true, /^\s+/g, TokenKind.Space],
        [true, /^:/g, TokenKind.Colon],
        [true, /^"/g, TokenKind.Quote],
        [true, /^>=/g, TokenKind.GreaterEqual],
        [true, /^<=/g, TokenKind.LessEqual],
        [true, /^>/g, TokenKind.GreaterThan],
        [true, /^</g, TokenKind.LessThan],
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

    const fieldExpression = apply(
        seq(
            tok(TokenKind.Term),
            tok(TokenKind.Colon),
            opt(
                alt(
                    tok(TokenKind.GreaterEqual),
                    tok(TokenKind.LessEqual),
                    tok(TokenKind.GreaterThan),
                    tok(TokenKind.LessThan),
                    str('='),
                ),
            ),
            alt(quotedString, term),
        ),
        (token) => {
            let condition
            switch (token[2]?.text) {
                case '=':
                    condition = new Equals(token[3])
                    break
                case '>':
                    condition = new GreaterThan(token[3])
                    break
                case '>=':
                    condition = new GreaterEqual(token[3])
                    break
                case '<':
                    condition = new LessThan(token[3])
                    break
                case '<=':
                    condition = new LessEqual(token[3])
                    break

                default:
                    condition = new Contains(token[3])
            }

            return new MatchField(token[0].text, condition)
        },
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
