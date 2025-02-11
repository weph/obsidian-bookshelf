import { ReadingProgress } from './reading-progress'
import { AggregatedTimeSeries } from './aggregated-time-series'

export enum Interval {
    Day,
    Week,
    Month,
    Year,
}

export class Statistics {
    constructor(private readingProgress: Array<ReadingProgress>) {}

    public pagesRead(interval: Interval): Map<Date, number> {
        if (this.readingProgress.length === 0) {
            return new Map<Date, number>()
        }

        const start = this.readingProgress[0].date
        const end = this.readingProgress[this.readingProgress.length - 1].date
        const series = new AggregatedTimeSeries(start, end, interval)

        for (const item of this.readingProgress) {
            series.add(item.date, item.pages)
        }

        return series.asMap()
    }
}
