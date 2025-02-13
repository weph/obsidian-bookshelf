import { ReadingJourneyItem } from './reading-journey/reading-journey'
import { AggregatedTimeSeries } from './aggregated-time-series'

export enum Interval {
    Day,
    Week,
    Month,
    Year,
}

export class Statistics {
    constructor(private readingJourney: Array<ReadingJourneyItem>) {}

    public years(): Array<number> {
        const years = new Set<number>()

        for (const item of this.readingJourney) {
            years.add(item.date.getFullYear())
        }

        return Array.from(years.values())
    }

    public pagesRead(interval: Interval): Map<Date, number> {
        if (this.readingJourney.length === 0) {
            return new Map<Date, number>()
        }

        const start = this.readingJourney[0].date
        const end = this.readingJourney[this.readingJourney.length - 1].date
        const series = new AggregatedTimeSeries(start, end, interval)

        for (const item of this.readingJourney) {
            if (item.action !== 'progress') {
                continue
            }

            series.add(item.date, item.pages)
        }

        return series.asMap()
    }
}
