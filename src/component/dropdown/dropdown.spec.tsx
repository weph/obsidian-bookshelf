import { beforeEach, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './dropdown'

const fooOption = { value: 'foo', label: 'Foo' }
const barOption = { value: 'bar', label: 'Bar' }
const onChange = vi.fn()

beforeEach(() => {
    document.body.innerHTML = ''
})

it('should show selected value', async () => {
    render(
        <Dropdown label="my-dropdown" value={barOption.value} options={[fooOption, barOption]} onChange={onChange} />,
    )

    expect(screen.getByLabelText('my-dropdown')).toHaveDisplayValue('Bar')
})

it('should update selected value', async () => {
    const result = render(
        <Dropdown label="my-dropdown" value={barOption.value} options={[fooOption, barOption]} onChange={onChange} />,
    )

    result.rerender(
        <Dropdown label="my-dropdown" value={fooOption.value} options={[fooOption, barOption]} onChange={onChange} />,
    )

    expect(screen.getByLabelText('my-dropdown')).toHaveDisplayValue('Foo')
})

it('should notify about changes', async () => {
    const fooOption = { value: 'foo', label: 'Foo' }
    const barOption = { value: 'bar', label: 'Bar' }
    render(<Dropdown label="my-dropdown" value={''} options={[fooOption, barOption]} onChange={onChange} />)

    await userEvent.selectOptions(await screen.findByLabelText('my-dropdown'), screen.getByText('Bar'))

    expect(onChange).toHaveBeenCalledWith(barOption)
})
