import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookDetails } from './book-details'
import { BookBuilder } from '../../support/book-builder'
import userEvent from '@testing-library/user-event'
import { position } from '../../bookshelf/reading-journey/position/position'
import { fireEvent } from '@testing-library/dom'

const openLink = vi.fn()
const addProgress = vi.fn()

beforeEach(() => {
    vi.resetAllMocks()

    document.body.innerHTML = ''
})

describe('Reading progress', () => {
    test('Prevent tracking without end page', async () => {
        const book = new BookBuilder().build()
        render(<BookDetails book={book} openLink={openLink} addProgress={addProgress} />)

        await selectAction('Read')
        await clickButton('add')

        expect(addProgress).not.toHaveBeenCalled()
    })

    test('Track progress without explicit start page', async () => {
        const book = new BookBuilder().build()
        render(<BookDetails book={book} openLink={openLink} addProgress={addProgress} />)

        await selectAction('Read')
        await selectDate('2025-03-20')
        await enterEndPosition('100')
        await clickButton('add')

        expect(addProgress).toHaveBeenCalledWith({
            date: new Date(2025, 2, 20),
            bookNote: book.note,
            action: 'progress',
            start: null,
            end: position(100),
        })
    })

    test('Track progress with start and end page', async () => {
        const book = new BookBuilder().build()
        render(<BookDetails book={book} openLink={openLink} addProgress={addProgress} />)

        await selectAction('Read')
        await selectDate('2025-03-20')
        await enterStartPosition('10')
        await enterEndPosition('100')
        await clickButton('add')

        expect(addProgress).toHaveBeenCalledWith({
            date: new Date(2025, 2, 20),
            bookNote: book.note,
            action: 'progress',
            start: position(10),
            end: position(100),
        })
    })
})

async function selectAction(action: string): Promise<void> {
    await userEvent.selectOptions(await screen.findByLabelText('Action'), screen.getByText(action))
}

async function selectDate(date: string): Promise<void> {
    fireEvent.change(await screen.findByLabelText('Date'), { target: { value: date } })
}

async function enterStartPosition(value: string): Promise<void> {
    await userEvent.type(await screen.findByLabelText('From'), value)
}

async function enterEndPosition(value: string): Promise<void> {
    await userEvent.type(await screen.findByLabelText('to'), value)
}

async function clickButton(name: string): Promise<void> {
    await userEvent.click(await screen.findByRole('button', { name }))
}
