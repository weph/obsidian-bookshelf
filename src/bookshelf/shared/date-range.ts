import { DateTime } from 'luxon'

export type Unit = 'year' | 'month' | 'custom'

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface DistinctCalendarUnits {
    years: number
    months: number
    days: number
}

export class DateRange {
    constructor(
        public readonly unit: Unit,
        public readonly start: Date,
        public readonly end: Date,
    ) {}

    public static custom(start: Date, end: Date) {
        return new DateRange('custom', start, end)
    }

    public static year(year: number): DateRange {
        return new DateRange('year', new Date(year, 0, 1), new Date(year, 11, 31))
    }

    public static month(year: number, month: Month): DateRange {
        const start = new Date(year, month - 1)
        const end = DateTime.fromJSDate(start)
            .endOf('month')
            .set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            })
            .toJSDate()

        return new DateRange('month', start, end)
    }

    public contains(date: Date): boolean {
        return date >= this.start && date <= this.end
    }

    public previous(): DateRange {
        const start = DateTime.fromJSDate(this.start)

        const prev = start.minus({ month: 1 })

        const daysBetween = DateTime.fromJSDate(this.end).diff(start, 'days').days

        switch (this.unit) {
            case 'year':
                return DateRange.year(this.start.getFullYear() - 1)
            case 'month':
                return DateRange.month(prev.year, prev.month as Month)
            case 'custom':
                return DateRange.custom(
                    start.minus({ days: daysBetween + 1 }).toJSDate(),
                    start.minus({ days: 1 }).toJSDate(),
                )
        }
    }

    public next(): DateRange {
        const start = DateTime.fromJSDate(this.start)
        const end = DateTime.fromJSDate(this.end)

        const prev = end.plus({ month: 1 })

        const daysBetween = end.diff(start, 'days').days

        switch (this.unit) {
            case 'year':
                return DateRange.year(this.start.getFullYear() + 1)
            case 'month':
                return DateRange.month(prev.year, prev.month as Month)
            case 'custom':
                return DateRange.custom(
                    end.plus({ days: 1 }).toJSDate(),
                    end.plus({ days: daysBetween + 1 }).toJSDate(),
                )
        }
    }

    public distinctCalendarUnits(): DistinctCalendarUnits {
        const start = DateTime.fromJSDate(this.start)
        const end = DateTime.fromJSDate(this.end)

        const years = end.year - start.year + 1
        const months = (end.year - start.year) * 12 + (end.month - start.month) + 1
        const days = end.diff(start, 'days').days + 1

        return {
            years,
            months,
            days,
        }
    }
}
