import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Input } from './input'
import { fireEvent } from '@testing-library/dom'
import { EventType } from '@testing-library/dom/types/events'
import { render, screen } from '@testing-library/react'

const onUpdate = vi.fn()

beforeEach(async () => {
    vi.resetAllMocks()

    document.body.innerHTML = ''
})

describe('onUpdate', () => {
    it.each(['input', 'keyUp', 'change'])('should notify about every %s event', (event: EventType) => {
        render(<Input type={''} placeholder={''} value={''} onUpdate={onUpdate} />)
        const internalInput = screen.getByRole('textbox')

        fireEvent[event](internalInput, { target: { value: 'f' } })
        fireEvent[event](internalInput, { target: { value: 'fo' } })
        fireEvent[event](internalInput, { target: { value: 'foo' } })

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
