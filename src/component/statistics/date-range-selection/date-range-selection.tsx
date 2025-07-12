import { Dropdown, DropdownOption } from '../../dropdown/dropdown'
import { DateRange, Month, Unit } from '../../../bookshelf/shared/date-range'
import { Input } from '../../input/input'
import { DateTime } from 'luxon'
import styles from './date-range-selection.module.scss'
import { Icon } from '../../icon/icon'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
    totalRange: DateRange
    value: DateRange | null
    onChange: (value: DateRange | null) => void
}

const unitOptions: Array<DropdownOption<Unit | null>> = [
    { value: null, label: 'All' },
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'custom', label: 'Custom' },
]

function rangeForUnit(unit: Unit | null, currentRange: DateRange, totalRange: DateRange): DateRange | null {
    if (unit === null) {
        return null
    }

    if (unit === 'year') {
        if (!totalRange.contains(currentRange.end)) {
            return DateRange.year(totalRange.end.getFullYear())
        }

        return DateRange.year(currentRange.end.getFullYear())
    }

    if (unit === 'month') {
        if (!totalRange.contains(currentRange.end)) {
            return DateRange.month(totalRange.end.getFullYear(), (totalRange.end.getMonth() + 1) as Month)
        }

        return DateRange.month(currentRange.end.getFullYear(), (currentRange.end.getMonth() + 1) as Month)
    }

    const start = currentRange.start < totalRange.start ? totalRange.start : currentRange.start
    const end = currentRange.end > totalRange.end ? totalRange.end : currentRange.end

    return DateRange.custom(start, end)
}

export function DateRangeSelection({ totalRange, value, onChange }: Props) {
    const unit = value?.unit || null

    return (
        <div className={styles.dateRangeSelection}>
            <div>
                <Dropdown
                    label="Unit"
                    value={unit}
                    options={unitOptions}
                    onChange={(o) => onChange(rangeForUnit(o.value, value || totalRange, totalRange))}
                />
            </div>

            {value && <Selection totalRange={totalRange} value={value} onChange={onChange} />}
        </div>
    )
}

interface SelectionProps {
    totalRange: DateRange
    value: DateRange
    onChange: (value: DateRange | null) => void
}

function Selection({ totalRange, value, onChange }: SelectionProps) {
    const unit = value.unit
    const previous = value.previous()
    const next = value.next()
    const prevDisabled = !(totalRange.contains(previous.start) || totalRange.contains(previous.end))
    const nextDisabled = !(totalRange.contains(next.start) || totalRange.contains(next.end))

    return (
        <div className={styles.month}>
            <Icon disabled={prevDisabled} icon={ChevronLeft} onClick={() => onChange(previous)} ariaLabel="Previous" />
            {unit === 'month' && <MonthSelection totalRange={totalRange} value={value} onChange={onChange} />}
            {unit === 'year' && <YearSelection totalRange={totalRange} value={value} onChange={onChange} />}
            {unit === 'custom' && <CustomSelection totalRange={totalRange} value={value} onChange={onChange} />}
            <Icon disabled={nextDisabled} icon={ChevronRight} onClick={() => onChange(next)} ariaLabel="Next" />
        </div>
    )
}

function yearOptions(range: DateRange): Array<DropdownOption<number>> {
    const years = []

    for (let year = range.start.getFullYear(); year <= range.end.getFullYear(); ++year) {
        years.push({ value: year, label: year.toString() })
    }

    return years
}

function YearSelection({ totalRange, value, onChange }: SelectionProps) {
    return (
        <Dropdown
            label="Year"
            value={value.start.getFullYear()}
            options={yearOptions(totalRange)}
            onChange={(o) => onChange(DateRange.year(o.value))}
        />
    )
}

function MonthSelection({ totalRange, value, onChange }: SelectionProps) {
    const monthOptions: Array<DropdownOption<Month>> = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ]

    const startYear = totalRange.start.getFullYear()
    const endYear = totalRange.end.getFullYear()

    const availableMonths = monthOptions.map((option) => {
        const available =
            (value.start.getFullYear() > startYear || option.value >= totalRange.start.getMonth() + 1) &&
            (value.start.getFullYear() < endYear || option.value <= totalRange.end.getMonth() + 1)

        return {
            ...option,
            disabled: !available,
        }
    })

    return (
        <>
            <Dropdown
                label="Month"
                value={value.start.getMonth() + 1}
                options={availableMonths}
                onChange={(o) => onChange(DateRange.month(value.start.getFullYear(), o.value))}
            />
            <Dropdown
                label="Year"
                value={value.start.getFullYear()}
                options={yearOptions(totalRange)}
                onChange={(o) => onChange(DateRange.month(o.value, (value.start.getMonth() + 1) as Month))}
            />
        </>
    )
}

function CustomSelection({ totalRange, value, onChange }: SelectionProps) {
    const isoDate = (date: Date) => DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')

    function changeStart(date: string): void {
        const start = DateTime.fromISO(date)

        if (start.isValid) {
            onChange(DateRange.custom(start.toJSDate(), value.end))
        }
    }

    function changeEnd(date: string): void {
        const end = DateTime.fromISO(date)

        if (end.isValid) {
            onChange(DateRange.custom(value.start, end.toJSDate()))
        }
    }

    return (
        <>
            <Input
                type="date"
                placeholder="Start"
                value={isoDate(value.start)}
                min={isoDate(totalRange.start)}
                max={isoDate(value.end)}
                onUpdate={changeStart}
            />
            <Input
                type="date"
                placeholder="End"
                value={isoDate(value.end)}
                min={isoDate(value.start)}
                max={isoDate(totalRange.end)}
                onUpdate={changeEnd}
            />
        </>
    )
}
