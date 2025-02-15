import { ReadingJourneyItem } from './reading-journey/reading-journey-log'
import { AggregatedTimeSeries } from './aggregated-time-series'
import { Book } from './book'

export enum Interval {
    Day,
    Week,
    Month,
    Year,
}

type Actions = {
    started: number
    finished: number
    abandoned: number
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

    public actions(): Actions {
        const result = {
            started: 0,
            finished: 0,
            abandoned: 0,
        }

        for (const item of this.readingJourney) {
            if (item.action !== 'progress') {
                ++result[item.action]
            }
        }

        return result
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

    public totalNumberOfPages(): number {
        return this.readingJourney.reduce((acc, item) => acc + (item.action === 'progress' ? item.pages : 0), 0)
    }

    public books(): Array<Book> {
        const result = new Set<Book>()

        for (const item of this.readingJourney) {
            result.add(item.book)
        }

        return Array.from(result.values())
    }
}
