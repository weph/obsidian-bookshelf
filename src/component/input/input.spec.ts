import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import './input'
import { Input } from './input'
import { fireEvent } from '@testing-library/dom'
import { EventType } from '@testing-library/dom/types/events'

const onUpdate = jest.fn()
let input: Input
let internalInput: HTMLInputElement

beforeEach(() => {
    jest.resetAllMocks()
    input = document.createElement('bookshelf-ui-input')
    input.onUpdate = onUpdate
    input.placeholder = 'my-input'
    internalInput = input.shadowRoot?.querySelector('input') as HTMLInputElement

    document.body.replaceChildren(input)
})

test('type property should be passed to internal input', () => {
    input.type = 'search'

    expect(internalInput.getAttribute('type')).toBe('search')
})

test('type placeholder should be passed to internal input', () => {
    input.placeholder = 'new-placeholder'

    expect(internalInput.getAttribute('placeholder')).toBe('new-placeholder')
})

describe('onUpdate', () => {
    it.each(['input', 'keyUp', 'change'])('should notify about every %s event', (event: EventType) => {
        fireEvent[event](internalInput, { target: { value: 'f' } })
        fireEvent[event](internalInput, { target: { value: 'fo' } })
        fireEvent[event](internalInput, { target: { value: 'foo' } })

        expect(onUpdate).toHaveBeenCalledTimes(3)
        expect(onUpdate).toHaveBeenNthCalledWith(1, 'f')
        expect(onUpdate).toHaveBeenNthCalledWith(2, 'fo')
        expect(onUpdate).toHaveBeenNthCalledWith(3, 'foo')
    })

    it('should ignore repeated events with the same value', () => {
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

    it('should stop responding to events after being disconnected', () => {
        input.disconnectedCallback()

        fireEvent.input(internalInput, { target: { value: 'f' } })
        fireEvent.change(internalInput, { target: { value: 'f' } })
        fireEvent.keyUp(internalInput, { target: { value: 'f' } })

        expect(onUpdate).not.toHaveBeenCalled()
    })
})
