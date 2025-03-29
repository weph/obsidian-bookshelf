import { ObsidianNote } from './obsidian-note'
import expect from 'expect'
import { afterAll, beforeAll, describe, test } from '../support/integration-test/integration-test'

describe('obsidian-note', () => {
    describe('frontmatter', () => {
        beforeAll(async (context) => {
            await context.deleteFile('meta.md')
            await context.createFile(
                'meta.md',
                `---
string: "string value"
int: 123
float: 1.23
date: 2011-07-06
datetime: 2003-02-01T12:30:00
boolean: true
link: "[[Note|Title]]"
list:
  - "a"
  - 1
  - 1.23
  - false
  - "[[Note|Title]]"
---
`,
            )
        })

        afterAll(async (context) => {
            await context.deleteFile('meta.md')
        })

        test('non-existing property should return null', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('something')).toBeNull()
        })

        test('string', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('string')).toBe('string value')
        })

        test('numeric (int)', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('int')).toBe(123)
        })

        test('numeric (float)', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('float')).toBe(1.23)
        })

        test('date', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('date')).toEqual('2011-07-06')
        })

        test('datetime', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('datetime')).toEqual('2003-02-01T12:30:00')
        })

        test('boolean', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('boolean')).toBe(true)
        })

        test('link', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('link')).toEqual({
                displayText: 'Title',
                key: 'link',
                link: 'Note',
                original: '[[Note|Title]]',
            })
        })

        test('list', async (context) => {
            const note = new ObsidianNote(context.file('meta.md'), context.app)

            expect(note.metadata.value('list')).toEqual([
                'a',
                1,
                1.23,
                false,
                {
                    displayText: 'Title',
                    key: 'list.4',
                    link: 'Note',
                    original: '[[Note|Title]]',
                },
            ])
        })
    })

    describe('listItems', () => {
        beforeAll(async (context) => {
            await context.createFile('listItems.md', '')
        })

        afterAll(async (context) => {
            await context.deleteFile('listItems.md')
        })

        test('it should return no items if heading does not exist', async (context) => {
            await context.updateFile(
                'listItems.md',
                `# Irrelevant Heading
            
- A
- B
- C
`,
            )
            const note = new ObsidianNote(context.file('listItems.md'), context.app)

            const result = note.listItems('Relevant Heading')

            expect(await generatorAsArray(result)).toEqual([])
        })

        test('list using dash', async (context) => {
            await context.updateFile(
                'listItems.md',
                `# Relevant Heading
            
- A
- B
- C
`,
            )
            const note = new ObsidianNote(context.file('listItems.md'), context.app)

            const result = note.listItems('Relevant Heading')

            expect(await generatorAsArray(result)).toEqual(['A', 'B', 'C'])
        })

        test('list using plus', async (context) => {
            await context.updateFile(
                'listItems.md',
                `# Relevant Heading
            
+ A
+ B
+ C
`,
            )
            const note = new ObsidianNote(context.file('listItems.md'), context.app)

            const result = note.listItems('Relevant Heading')

            expect(await generatorAsArray(result)).toEqual(['A', 'B', 'C'])
        })

        test('list using asterisk', async (context) => {
            await context.updateFile(
                'listItems.md',
                `# Relevant Heading
            
* A
* B
* C
`,
            )
            const note = new ObsidianNote(context.file('listItems.md'), context.app)

            const result = note.listItems('Relevant Heading')

            expect(await generatorAsArray(result)).toEqual(['A', 'B', 'C'])
        })
    })

    describe('appendToList', () => {
        beforeAll(async (context) => {
            await context.createFile('appendToList.md', '')
        })

        afterAll(async (context) => {
            await context.deleteFile('appendToList.md')
        })

        test('append new heading and list to empty note', async (context) => {
            await context.updateFile('appendToList.md', ``)
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 1')
            })

            expect(await note.content()).toEqual(`## Relevant Heading

- Item 1`)
        })

        test('append new heading and list after frontmatter', async (context) => {
            await context.updateFile(
                'appendToList.md',
                `---
foo: bar
---`,
            )
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 1')
            })

            expect(await note.content()).toEqual(`---
foo: bar
---

## Relevant Heading

- Item 1`)
        })

        test('append new heading and list at the end of the note if heading does not exist yet', async (context) => {
            await context.updateFile(
                'appendToList.md',
                `# Note Title

## Some heading

Some text`,
            )
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 1')
            })

            expect(await note.content()).toEqual(`# Note Title

## Some heading

Some text

## Relevant Heading

- Item 1`)
        })

        test('append new list to existing heading (no content)', async (context) => {
            await context.updateFile('appendToList.md', `# Relevant Heading`)
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 1')
            })

            expect(await note.content()).toEqual(`# Relevant Heading

- Item 1`)
        })

        test('append new list to existing heading after content', async (context) => {
            await context.updateFile(
                'appendToList.md',
                `# Relevant Heading

Lorem ipsum dolor sit amet`,
            )
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 1')
            })

            expect(await note.content()).toEqual(`# Relevant Heading

Lorem ipsum dolor sit amet

- Item 1`)
        })

        test('append item to existing list', async (context) => {
            await context.updateFile(
                'appendToList.md',
                `# Relevant Heading

- Item 1`,
            )
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 2')
            })

            expect(await note.content()).toEqual(`# Relevant Heading

- Item 1
- Item 2`)
        })

        test('reuse list symbol', async (context) => {
            await context.updateFile(
                'appendToList.md',
                `# Relevant Heading

* Item 1`,
            )
            const note = new ObsidianNote(context.file('appendToList.md'), context.app)

            await context.waitForUpdate('appendToList.md', async () => {
                await note.appendToList('Relevant Heading', 'Item 2')
            })

            expect(await note.content()).toEqual(`# Relevant Heading

* Item 1
* Item 2`)
        })
    })
})

async function generatorAsArray<T>(gen: AsyncIterable<T>): Promise<T[]> {
    const result: Array<T> = []

    for await (const x of gen) {
        result.push(x)
    }

    return result
}
