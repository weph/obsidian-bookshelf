import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { Input } from './input'
import { fireEvent } from '@testing-library/dom'
import { EventType } from '@testing-library/dom/types/events'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const onUpdate = vi.fn()

beforeEach(async () => {
    vi.resetAllMocks()

    document.body.innerHTML = ''
})

describe('onUpdate', () => {
    it.each(['input', 'keyUp', 'change'])('should notify about every %s event', (event: string) => {
        render(<Input type={''} placeholder={''} value={''} onUpdate={onUpdate} />)
        const internalInput = screen.getByRole('textbox')

        fireEvent[event as EventType](internalInput, { target: { value: 'f' } })
        fireEvent[event as EventType](internalInput, { target: { value: 'fo' } })
        fireEvent[event as EventType](internalInput, { target: { value: 'foo' } })

        expect(onUpdate).toHaveBeenCalledTimes(3)
        expect(onUpdate).toHaveBeenNthCalledWith(1, 'f')
        expect(onUpdate).toHaveBeenNthCalledWith(2, 'fo')
        expect(onUpdate).toHaveBeenNthCalledWith(3, 'foo')
    })

    it('should ignore repeated events with the same value', () => {
        render(<Input type={''} placeholder={''} value={''} onUpdate={onUpdate} />)
        const internalInput = screen.getByRole('textbox')

        fireEvent.keyDown(internalInput, { target: { value: 'foo' } })
        fireEvent.input(internalInput, { target: { value: 'foo' } })
        fireEvent.change(internalInput, { target: { value: 'foo' } })

        fireEvent.input(internalInput, { target: { value: 'bar' } })
        fireEvent.change(internalInput, { target: { value: 'bar' } })
        fireEvent.keyDown(internalInput, { target: { value: 'bar' } })

        fireEvent.change(internalInput, { target: { value: 'baz' } })
        fireEvent.keyDown(internalInput, { target: { value: 'baz' } })
        fireEvent.input(internalInput, { target: { value: 'baz' } })

        expect(onUpdate).toHaveBeenCalledTimes(3)
        expect(onUpdate).toHaveBeenNthCalledWith(1, 'foo')
        expect(onUpdate).toHaveBeenNthCalledWith(2, 'bar')
        expect(onUpdate).toHaveBeenNthCalledWith(3, 'baz')
    })
})

test('clear search', async () => {
    render(<Input type={''} placeholder={''} value={'value'} onUpdate={onUpdate} clearable={true} />)

    await userEvent.click(screen.getByLabelText('Clear search'))

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenNthCalledWith(1, '')
})
