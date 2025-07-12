import { Chart, TimeSeriesScale, TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Interval, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { Dropdown, DropdownOption } from '../../dropdown/dropdown'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

export type AvailableInterval = 'year' | 'month' | 'week' | 'day'

interface Props {
    statistics: Statistics
    availableIntervals: Array<AvailableInterval>
}

interface IntervalDropdownOption extends DropdownOption<AvailableInterval> {
    chart: TimeUnit
    statistics: Interval
}

const intervalOptions: Array<IntervalDropdownOption> = [
    {
        value: 'year',
        label: 'Year',
        chart: 'year',
        statistics: Interval.Year,
    },
    {
        value: 'month',
        label: 'Month',
        chart: 'month',
        statistics: Interval.Month,
    },
    {
        value: 'week',
        label: 'Week',
        chart: 'week',
        statistics: Interval.Week,
    },
    {
        value: 'day',
        label: 'Day',
        chart: 'day',
        statistics: Interval.Day,
    },
]

Chart.register(TimeSeriesScale)

export function PagesReadChart({ statistics, availableIntervals }: Props) {
    const availableIntervalOptions = intervalOptions.filter((o) => availableIntervals.includes(o.value))
    const [interval, setInterval] = useState<IntervalDropdownOption>(availableIntervalOptions[0])

    useEffect(() => {
        if (!availableIntervalOptions.includes(interval)) {
            setInterval(availableIntervalOptions[0])
        }
    }, [availableIntervals])

    const data = Array.from(statistics.pagesRead(interval.statistics).entries()).map((entry) => ({
        x: entry[0].getTime(),
        y: entry[1],
    }))

    return (
        <>
            <Dropdown
                label="Interval"
                value={interval.value}
                options={availableIntervalOptions}
                onChange={(o) => setInterval(o)}
            />

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
                                    unit: interval.chart,
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
