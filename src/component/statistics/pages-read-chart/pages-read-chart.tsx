import { Chart, TimeSeriesScale, TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Interval, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { Dropdown } from '../../dropdown/dropdown'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

interface IntervalValue {
    chart: TimeUnit
    statistics: Interval
    label: string
}

interface Props {
    statistics: Statistics
    availableIntervals: Array<'year' | 'month' | 'week' | 'day'>
}

const intervals: { [key: string]: IntervalValue } = {
    year: {
        chart: 'year',
        statistics: Interval.Year,
        label: 'Year',
    },
    month: {
        chart: 'month',
        statistics: Interval.Month,
        label: 'Month',
    },
    week: {
        chart: 'week',
        statistics: Interval.Week,
        label: 'Week',
    },
    day: {
        chart: 'day',
        statistics: Interval.Day,
        label: 'Day',
    },
}

Chart.register(TimeSeriesScale)

export function PagesReadChart({ statistics, availableIntervals }: Props) {
    const [interval, setInterval] = useState(availableIntervals[0])

    const intervalOptions = availableIntervals.map((i) => ({
        value: i,
        label: intervals[i].label,
    }))

    useEffect(() => {
        setInterval(availableIntervals[0])
    }, [availableIntervals])

    const data = Array.from(statistics.pagesRead(intervals[interval].statistics).entries()).map((entry) => ({
        x: entry[0].getTime(),
        y: entry[1],
    }))

    return (
        <>
            <Dropdown label="Interval" value={interval} options={intervalOptions} onChange={setInterval} />

            <div style={{ width: '100%', aspectRatio: '2/1' }}>
                <Bar
                    data={{
                        datasets: [
                            {
                                label: '# of pages',
                                data,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        scales: {
                            x: {
                                type: 'timeseries',
                                time: {
                                    unit: intervals[interval].chart,
                                },
                            },
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </>
    )
}
