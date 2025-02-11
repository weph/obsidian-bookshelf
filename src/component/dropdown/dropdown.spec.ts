import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import './dropdown'
import { Dropdown } from './dropdown'
import { screen } from 'shadow-dom-testing-library'
import userEvent from '@testing-library/user-event'

const fooValue = { name: 'foo' }
const barValue = { name: 'bar' }
const onChange = jest.fn()
let dropdown: Dropdown<{ name: string }>

beforeEach(() => {
    jest.resetAllMocks()
    dropdown = document.createElement('bookshelf-ui-dropdown')
    dropdown.label = 'my-dropdown'
    dropdown.onChange = onChange
    dropdown.options = [
        { value: fooValue, label: 'Foo' },
        { value: barValue, label: 'Bar' },
    ]

    document.body.replaceChildren(dropdown)
})

it('should show selected value', () => {
    dropdown.value = barValue

    expect(screen.getByShadowLabelText('my-dropdown')).toHaveDisplayValue('Bar')
})

describe('onChange', () => {
    it('should notify about changes', async () => {
        await userEvent.selectOptions(screen.getByShadowLabelText('my-dropdown'), 'Bar')

        expect(onChange).toHaveBeenCalledWith(barValue)
    })

    it('must not notify if the component has been disconnected', async () => {
        dropdown.disconnectedCallback()

        await userEvent.selectOptions(screen.getByShadowLabelText('my-dropdown'), 'Foo')

        expect(onChange).not.toHaveBeenCalled()
    })
})
