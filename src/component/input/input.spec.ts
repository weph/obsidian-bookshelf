import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import './input'
import { Input } from './input'
import { fireEvent } from '@testing-library/dom'
import { EventType } from '@testing-library/dom/types/events'

const onUpdate = jest.fn()
let input: Input
let internalInput: HTMLInputElement

beforeEach(async () => {
    jest.resetAllMocks()
    input = document.createElement('bookshelf-ui-input')
    input.onUpdate = onUpdate
    input.placeholder = 'my-input'

    document.body.replaceChildren(input)
    await input.updateComplete

    internalInput = input.shadowRoot?.querySelector('input') as HTMLInputElement
})

test('type property should be passed to internal input', async () => {
    input.type = 'search'

    await input.updateComplete

    expect(internalInput.getAttribute('type')).toBe('search')
})

test('type placeholder should be passed to internal input', async () => {
    input.placeholder = 'new-placeholder'

    await input.updateComplete

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
})
