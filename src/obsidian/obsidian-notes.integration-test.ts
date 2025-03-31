import expect from 'expect'
import { beforeEach, describe, test } from '../support/integration-test/integration-test'
import { ObsidianNotes } from './obsidian-notes'

describe('obsidian-notes', () => {
    describe('noteByLink', () => {
        beforeEach(async (context) => {
            await context.deleteFile('note.md')
        })

        test('return null for non-existing note', async (context) => {
            const notes = new ObsidianNotes(context.app)

            expect(notes.noteByLink('[[note]]')).toBeNull()
        })

        test('return existing note', async (context) => {
            const notes = new ObsidianNotes(context.app)
            await context.createFile('note.md', '# Note')

            const note = notes.noteByLink('[[note]]')

            expect(note).not.toBeUndefined()
            expect(await note!.content()).toEqual('# Note')
        })
    })
})
