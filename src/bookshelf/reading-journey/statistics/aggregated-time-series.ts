import { Interval } from './statistics'
import { DateTime } from 'luxon'

export class AggregatedTimeSeries<TInput, TOutput> {
    private dateObjects = new Map<string, Date>()

    private readonly result = new Map<Date, TOutput>()

    constructor(
        public readonly start: Date,
        public readonly end: Date,
        public readonly interval: Interval,
        public readonly initialValue: () => TOutput,
        public readonly updatedValue: (current: TOutput, input: TInput) => TOutput,
    ) {
        const last = DateTime.fromJSDate(end)
        let current = DateTime.fromJSDate(start)
        while (current <= last) {
            this.result.set(this.dateKey(current.toJSDate(), interval), initialValue())

            current = current.plus({ day: 1 })
        }
    }

    public add(date: Date, value: TInput): void {
        const key = this.dateKey(date, this.interval)

        this.result.set(key, this.updatedValue(this.result.get(key) || this.initialValue(), value))
    }

    public asMap(): Map<Date, TOutput> {
        return this.result
    }

    public entries(): MapIterator<[Date, TOutput]> {
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
