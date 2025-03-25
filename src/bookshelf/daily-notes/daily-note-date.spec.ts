import { expect, test } from 'vitest'
import { dailyNoteDate } from './daily-note-date'

test.each([
    ['1234-56-78.md', 'YYYY-MM-DD', null, null],
    ['01/01/2024.md', 'YYYY-MM-DD', null, null],
    ['2024-10-12.md', 'YYYY-MM-DD', null, new Date(2024, 9, 12)],
    ['Some Folder/2024-10-12.md', 'YYYY-MM-DD', null, new Date(2024, 9, 12)],
    ['2024-10-12.md', 'YYYY-MM-DD', 'Daily Notes', null],
    ['Daily Notes/2024-10-12.md', 'YYYY-MM-DD', 'Daily Notes', new Date(2024, 9, 12)],
    ['Daily Notes/Extra/2024-10-12.md', 'YYYY-MM-DD', 'Daily Notes', new Date(2024, 9, 12)],
    ['Daily Notes/2024/10/2024-10-12.md', 'YYYY/MM/YYYY-MM-DD', 'Daily Notes', new Date(2024, 9, 12)],
    ['Daily Notes/2024/10/2024-10-12.md', 'YYYY/MM/YYYY-MM-DD', 'Daily Notes/', new Date(2024, 9, 12)],
])('Note "%s" with format "%s" and folder "%s" => %s', (path, format, folder, expected) => {
    expect(dailyNoteDate(path, format, folder)).toEqual(expected)
})
