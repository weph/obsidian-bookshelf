import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './dropdown'

const fooValue = 'foo-value'
const barValue = 'bar-value'
const onChange = vi.fn()

beforeEach(() => {
    document.body.innerHTML = ''
})

it('should show selected value', async () => {
    render(
        <Dropdown
            label="my-dropdown"
            value={barValue}
            options={[
                { value: fooValue, label: 'Foo' },
                { value: barValue, label: 'Bar' },
            ]}
            onChange={onChange}
        />,
    )

    expect(screen.getByLabelText('my-dropdown')).toHaveDisplayValue('Bar')
})

describe('onChange', () => {
    it('should notify about changes', async () => {
        render(
            <Dropdown
                label="my-dropdown"
                value={''}
                options={[
                    { value: fooValue, label: 'Foo' },
                    { value: barValue, label: 'Bar' },
                ]}
                onChange={onChange}
            />,
        )

        await userEvent.selectOptions(await screen.findByLabelText('my-dropdown'), screen.getByText('Bar'))

        expect(onChange).toHaveBeenCalledWith(barValue)
    })
})
