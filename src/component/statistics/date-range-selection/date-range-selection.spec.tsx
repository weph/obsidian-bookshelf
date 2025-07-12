import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { DateRangeSelection } from './date-range-selection'
import { DateRange } from '../../../bookshelf/shared/date-range'

const onChange = vi.fn()
let user: UserEvent

beforeEach(() => {
    vi.resetAllMocks()

    document.body.innerHTML = ''

    user = userEvent.setup()
})

describe('"All" selected', () => {
    test('Year: change to last year of total range', async () => {
        renderComponent(DateRange.custom(new Date(2024, 1, 15), new Date(2025, 8, 21)), null)

        await selectYear()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.year(2025))
    })

    test('Month: change to last month and year of total range', async () => {
        renderComponent(DateRange.custom(new Date(2024, 1, 15), new Date(2025, 8, 21)), null)

        await selectMonth()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 9))
    })

    test('Custom: change to custom range covering total range (total range is year)', async () => {
        renderComponent(DateRange.year(2025), null)

        await selectCustom()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 11, 31)))
    })

    test('Custom: change to custom range covering total range (total range is month)', async () => {
        renderComponent(DateRange.month(2025, 2), null)

        await selectCustom()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.custom(new Date(2025, 1, 1), new Date(2025, 1, 28)))
    })

    test('Custom: change to custom range covering total range (total range is custom)', async () => {
        const totalRange = DateRange.custom(new Date(2024, 1, 15), new Date(2025, 8, 21))
        renderComponent(totalRange, null)

        await selectCustom()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(totalRange)
    })
})

describe('Month selected', () => {
    test('Months: limit available months (total range is less than a year)', async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2024, 4, 21)), DateRange.month(2024, 3))

        expect(availableMonths()).toEqual(['March', 'April', 'May'])
    })

    test('Months: limit available months (partial start year)', async () => {
        renderComponent(DateRange.custom(new Date(2024, 9, 15), new Date(2026, 2, 21)), DateRange.month(2024, 10))

        expect(availableMonths()).toEqual(['October', 'November', 'December'])
    })

    test('Months: limit available months (partial end year)', async () => {
        renderComponent(DateRange.custom(new Date(2024, 9, 15), new Date(2026, 2, 21)), DateRange.month(2026, 1))

        expect(availableMonths()).toEqual(['January', 'February', 'March'])
    })

    test('Months: all months are available in full year', async () => {
        renderComponent(DateRange.custom(new Date(2024, 9, 15), new Date(2026, 2, 21)), DateRange.month(2025, 1))

        expect(availableMonths()).toEqual([
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ])
    })

    test("Custom: change to custom range covering value's month", async () => {
        renderComponent(DateRange.custom(new Date(2024, 1, 15), new Date(2025, 8, 21)), DateRange.month(2024, 2))

        await selectCustom()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.custom(new Date(2024, 1, 15), new Date(2024, 1, 29)))
    })

    test('Previous: change to previous month (previous month fully covered by total range)', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 8, 21)), DateRange.month(2025, 2))

        await clickPrevious()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 1))
    })

    test('Previous: change to previous month (previous month partially covered by total range)', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 10), new Date(2025, 8, 21)), DateRange.month(2025, 2))

        await clickPrevious()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 1))
    })

    test('Previous: do nothing if previous month is not covered by total range', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 8, 21)), DateRange.month(2025, 1))

        await clickPrevious()

        expect(onChange).not.toHaveBeenCalled()
    })

    test('Next: change to next month (next month fully covered by total range)', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 2, 31)), DateRange.month(2025, 2))

        await clickNext()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 3))
    })

    test('Next: change to next month (next month partially covered by total range)', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 2, 15)), DateRange.month(2025, 2))

        await clickNext()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 3))
    })

    test('Next: do nothing if next month is not covered by total range', async () => {
        renderComponent(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 2, 31)), DateRange.month(2025, 3))

        await clickNext()

        expect(onChange).not.toHaveBeenCalled()
    })
})

describe('Year selected', () => {
    test('All: change to `null`"', async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2025, 8, 21)), DateRange.year(2025))

        await selectAll()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(null)
    })

    test("Month: change to December of value's year if's is still in total range", async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2025, 8, 21)), DateRange.year(2024))

        await selectMonth()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2024, 12))
    })

    test('Month: change to last month of total range if it does not include December', async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2025, 8, 21)), DateRange.year(2025))

        await selectMonth()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 9))
    })

    test("Custom: change to custom range covering value's year", async () => {
        renderComponent(DateRange.custom(new Date(2024, 1, 15), new Date(2025, 8, 21)), DateRange.year(2025))

        await selectCustom()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.custom(new Date(2025, 0, 1), new Date(2025, 8, 21)))
    })
})

describe('Custom range selected', () => {
    const value = DateRange.custom(new Date(2025, 0, 20), new Date(2025, 1, 10))

    test('All: change to `null`"', async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2025, 8, 21)), value)

        await selectAll()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(null)
    })

    test("Year: change to value's last year", async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2026, 0, 31)), value)

        await selectYear()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.year(2025))
    })

    test("Year: change to last year of total range if value's last year is not covered by total range", async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2024, 0, 31)), value)

        await selectYear()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.year(2024))
    })

    test("Month: change to last month of value if it's still covered by total range", async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2026, 0, 31)), value)

        await selectMonth()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2025, 2))
    })

    test("Month: change to last month of total range if value's last month is not covered by total range", async () => {
        renderComponent(DateRange.custom(new Date(2024, 2, 15), new Date(2024, 8, 21)), value)

        await selectMonth()

        expect(onChange).toHaveBeenCalledExactlyOnceWith(DateRange.month(2024, 9))
    })
})

function renderComponent(totalRange: DateRange, value: DateRange | null): void {
    render(<DateRangeSelection totalRange={totalRange} value={value} onChange={onChange} />)
}

function selectAll() {
    return user.selectOptions(screen.getByLabelText('Unit'), 'All')
}

function selectYear() {
    return user.selectOptions(screen.getByLabelText('Unit'), 'Year')
}

function selectMonth() {
    return user.selectOptions(screen.getByLabelText('Unit'), 'Month')
}

function selectCustom() {
    return user.selectOptions(screen.getByLabelText('Unit'), 'Custom')
}

function clickPrevious() {
    return user.click(screen.getByLabelText('Previous'))
}

function clickNext() {
    return user.click(screen.getByLabelText('Next'))
}

function availableMonths(): Array<string> {
    const element = screen.getByLabelText('Month') as HTMLSelectElement

    return Array.from(element.options)
        .filter((e) => !e.disabled)
        .map((e) => e.label)
}
