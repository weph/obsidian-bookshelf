import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import './dropdown'
import { Dropdown } from './dropdown'
import { screen } from 'shadow-dom-testing-library'
import userEvent from '@testing-library/user-event'

const fooValue = 'foo-value'
const barValue = 'bar-value'
const onChange = jest.fn()
let dropdown: Dropdown

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

it('should show selected value', async () => {
    dropdown.value = barValue

    await dropdown.updateComplete

    expect(screen.getByShadowLabelText('my-dropdown')).toHaveDisplayValue('Bar')
})

describe('onChange', () => {
    it('should notify about changes', async () => {
        await userEvent.selectOptions(await screen.findByShadowLabelText('my-dropdown'), screen.getByShadowText('Bar'))

        expect(onChange).toHaveBeenCalledWith(barValue)
    })
})
