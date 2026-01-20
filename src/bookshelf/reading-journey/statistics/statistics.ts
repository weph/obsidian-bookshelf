import { AggregatedTimeSeries } from './aggregated-time-series'
import { Book } from '../../book/book'
import { ReadingJourney } from '../reading-journey'
import { ReadingJourneyProgressItem } from '../reading-journey-log'

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

export type PagesRead = {
    total: number
    books: Map<string, number>
}

export class Statistics {
    constructor(private readingJourney: ReadingJourney) {}

    public years(): Array<number> {
        const years = new Set<number>()

        for (const item of this.readingJourney.items()) {
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

        for (const item of this.readingJourney.items()) {
            if (item.action !== 'progress') {
                ++result[item.action]
            }
        }

        return result
    }

    public pagesRead(interval: Interval): Map<Date, PagesRead> {
        const items = this.readingJourney.items().filter((i) => i.action === 'progress')
        if (items.length === 0) {
            return new Map<Date, PagesRead>()
        }

        const start = items[0].date
        const end = items[items.length - 1].date
        const series = new AggregatedTimeSeries(
            start,
            end,
            interval,
            (): PagesRead => ({ total: 0, books: new Map<string, number>() }),
            (c, v: ReadingJourneyProgressItem) => {
                if (!c.books.has(v.book.metadata.title)) {
                    c.books.set(v.book.metadata.title, v.pages || 0)
                }

                c.total += v.pages || 0

                return c
            },
        )

        for (const item of items) {
            series.add(item.date, item)
        }

        return series.asMap()
    }

    public totalNumberOfPages(): number {
        return this.readingJourney
            .items()
            .reduce((acc, item) => acc + (item.action === 'progress' ? item.pages || 0 : 0), 0)
    }

    public books(): Array<Book> {
        return Array.from(this.readingJourney.books())
    }

    public tagUsage(): Map<string, number> {
        return this.readingJourney.tagUsage()
    }
}
