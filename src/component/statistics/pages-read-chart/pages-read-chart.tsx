import { Chart, TimeSeriesScale, TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Interval, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { Dropdown } from '../../dropdown/dropdown'
import { PagesReadBarChart } from '../../chart/pages-read-bar-chart/pages-read-bar-chart'
import { useState } from 'react'

interface IntervalValue {
    chart: TimeUnit
    statistics: Interval
}

interface Props {
    statistics: Statistics
}

const intervals: { [key: string]: IntervalValue } = {
    year: {
        chart: 'year',
        statistics: Interval.Year,
    },
    month: {
        chart: 'month',
        statistics: Interval.Month,
    },
    week: {
        chart: 'week',
        statistics: Interval.Week,
    },
    day: {
        chart: 'day',
        statistics: Interval.Day,
    },
}

const intervalOptions = [
    {
        value: 'year',
        label: 'Year',
    },
    {
        value: 'month',
        label: 'Month',
    },
    {
        value: 'week',
        label: 'Week',
    },
    {
        value: 'day',
        label: 'Day',
    },
]

Chart.register(TimeSeriesScale)

export function PagesReadChart({ statistics }: Props) {
    const [interval, setInterval] = useState('year')

    const data = () => {
        return Array.from(statistics.pagesRead(intervals[interval].statistics).entries()).map((entry) => ({
            x: entry[0].getTime(),
            y: entry[1],
        }))
    }

    return (
        <>
            <Dropdown label="Interval" value={interval} options={intervalOptions} onChange={setInterval} />

            <div style={{ width: '100%', aspectRatio: '2/1' }}>
                <PagesReadBarChart data={data()} xAxisUnit={intervals[interval].chart} />
            </div>
        </>
    )
}
