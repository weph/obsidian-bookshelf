import { Interval } from './statistics'
import { DateTime } from 'luxon'

export class AggregatedTimeSeries {
    private dateObjects = new Map<string, Date>()

    private readonly result = new Map<Date, number>()

    constructor(
        public readonly start: Date,
        public readonly end: Date,
        public readonly interval: Interval,
    ) {
        const last = DateTime.fromJSDate(end)
        let current = DateTime.fromJSDate(start)
        while (current <= last) {
            this.result.set(this.dateKey(current.toJSDate(), interval), 0)

            current = current.plus({ day: 1 })
        }
    }

    public add(date: Date, value: number): void {
        const key = this.dateKey(date, this.interval)

        this.result.set(key, (this.result.get(key) || 0) + value)
    }

    public asMap(): Map<Date, number> {
        return this.result
    }

    public entries(): MapIterator<[Date, number]> {
        return this.result.entries()
    }

    private dateKey(date: Date, interval: Interval): Date {
        const luxonDate = DateTime.fromJSDate(date)

        switch (interval) {
            case Interval.Day:
                return this.dateObject(luxonDate)
            case Interval.Week:
                return this.dateObject(luxonDate.startOf('week'))
            case Interval.Month:
                return this.dateObject(luxonDate.startOf('month'))
            case Interval.Year:
                return this.dateObject(luxonDate.startOf('year'))
        }
    }

    private dateObject(dateAsString: DateTime): Date {
        const asString = dateAsString.toFormat('yyyy-MM-dd')
        if (!this.dateObjects.has(asString)) {
            this.dateObjects.set(asString, dateAsString.toJSDate())
        }

        return this.dateObjects.get(asString)!
    }
}
