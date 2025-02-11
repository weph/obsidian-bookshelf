import { describe, expect, it } from '@jest/globals'
import { AggregatedTimeSeries } from './aggregated-time-series'
import { Interval } from './statistics'
import { DateTime } from 'luxon'

describe('Time series aggregated by year', () => {
    it('should have an entry for every year between start and end', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 0, 1), new Date(2026, 5, 15), Interval.Year)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-01-01': 0,
            '2024-01-01': 0,
            '2025-01-01': 0,
            '2026-01-01': 0,
        })
    })

    it('should aggregate values', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 0, 1), new Date(2026, 5, 15), Interval.Year)

        series.add(new Date(2023, 0, 1), 10)
        series.add(new Date(2023, 0, 1), 20)
        series.add(new Date(2024, 5, 1), 100)
        series.add(new Date(2024, 10, 1), 50)
        series.add(new Date(2026, 11, 31), 99)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-01-01': 30,
            '2024-01-01': 150,
            '2025-01-01': 0,
            '2026-01-01': 99,
        })
    })
})

describe('Time series aggregated by month', () => {
    it('should have an entry for every month between start and end', () => {
        const series = new AggregatedTimeSeries(new Date(2024, 0, 15), new Date(2024, 3, 1), Interval.Month)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2024-01-01': 0,
            '2024-02-01': 0,
            '2024-03-01': 0,
            '2024-04-01': 0,
        })
    })

    it('should aggregate values', () => {
        const series = new AggregatedTimeSeries(new Date(2024, 0, 15), new Date(2024, 3, 1), Interval.Month)

        series.add(new Date(2024, 0, 1), 10)
        series.add(new Date(2024, 0, 31), 15)
        series.add(new Date(2024, 1, 15), 20)
        series.add(new Date(2024, 2, 1), 10)
        series.add(new Date(2024, 2, 1), 20)
        series.add(new Date(2024, 2, 1), 30)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2024-01-01': 25,
            '2024-02-01': 20,
            '2024-03-01': 60,
            '2024-04-01': 0,
        })
    })
})

describe('Time series aggregated by week', () => {
    it('should have an entry for every week between start and end', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 11, 30), new Date(2024, 0, 17), Interval.Week)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-12-25': 0,
            '2024-01-01': 0,
            '2024-01-08': 0,
            '2024-01-15': 0,
        })
    })

    it('should aggregate values', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 11, 30), new Date(2024, 0, 17), Interval.Week)

        series.add(new Date(2024, 0, 1), 10)
        series.add(new Date(2024, 0, 1), 20)
        series.add(new Date(2024, 0, 2), 30)
        series.add(new Date(2024, 0, 3), 40)
        series.add(new Date(2024, 0, 10), 15)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-12-25': 0,
            '2024-01-01': 100,
            '2024-01-08': 15,
            '2024-01-15': 0,
        })
    })
})

describe('Time series aggregated by day', () => {
    it('should have an entry for every day between start and end', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 11, 30), new Date(2024, 0, 3), Interval.Day)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-12-30': 0,
            '2023-12-31': 0,
            '2024-01-01': 0,
            '2024-01-02': 0,
            '2024-01-03': 0,
        })
    })

    it('should aggregate values', () => {
        const series = new AggregatedTimeSeries(new Date(2023, 11, 30), new Date(2024, 0, 3), Interval.Day)

        series.add(new Date(2024, 0, 1), 10)
        series.add(new Date(2024, 0, 1), 20)
        series.add(new Date(2024, 0, 1), 30)
        series.add(new Date(2024, 0, 2), 40)

        expect(iteratorAsObject(series.entries())).toEqual({
            '2023-12-30': 0,
            '2023-12-31': 0,
            '2024-01-01': 60,
            '2024-01-02': 40,
            '2024-01-03': 0,
        })
    })
})

function iteratorAsObject(input: MapIterator<[Date, number]>): { [key: string]: number } {
    const result: { [key: string]: number } = {}

    for (const [date, count] of input) {
        result[DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')] = count
    }

    return result
}
