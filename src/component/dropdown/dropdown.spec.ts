import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import './dropdown'
import { Dropdown } from './dropdown'
import { screen } from 'shadow-dom-testing-library'
import userEvent from '@testing-library/user-event'

const onChange = jest.fn()
let dropdown: Dropdown

beforeEach(() => {
    jest.resetAllMocks()
    dropdown = document.createElement('bookshelf-ui-dropdown')
    dropdown.label = 'my-dropdown'
    dropdown.onChange = onChange
    dropdown.options = [
        { value: 'foo', label: 'Foo' },
        { value: 'bar', label: 'Bar' },
    ]

    document.body.replaceChildren(dropdown)
})

describe('onChange', () => {
    it('should notify about changes', async () => {
        await userEvent.selectOptions(screen.getByShadowLabelText('my-dropdown'), 'Bar')

        expect(onChange).toHaveBeenCalledWith('bar')
    })

    it('must not notify if the component has been disconnected', async () => {
        dropdown.disconnectedCallback()

        await userEvent.selectOptions(screen.getByShadowLabelText('my-dropdown'), 'Foo')

        expect(onChange).not.toHaveBeenCalled()
    })
})
