import { Pattern, PatternCollection } from './pattern-collection'
import { expect, it } from '@jest/globals'

class FakePattern implements Pattern<string> {
    constructor(private readonly value: string) {}

    public matches(input: string): string | null {
        return input === this.value ? `matches "${this.value}"` : null
    }
}

const subject = new PatternCollection([new FakePattern('foo'), new FakePattern('bar'), new FakePattern('baz')])

it.each([
    ['foo', 'matches "foo"'],
    ['bar', 'matches "bar"'],
    ['baz', 'matches "baz"'],
    ['foobar', null],
])('it should return the first match or null if no pattern matches (%s => %s)', (input, expected) => {
    expect(subject.matches(input)).toBe(expected)
})
