import Chart, { TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Interval, Statistics } from '../../../statistics'
import { Dropdown } from '../../dropdown/dropdown'

export interface ReadingProgressBarChartProps {
    statistics: Statistics
}

interface IntervalValue {
    chart: TimeUnit
    statistics: Interval
}

export class PagesReadChart extends HTMLElement implements ReadingProgressBarChartProps {
    private root: ShadowRoot

    private intervals: { [key: string]: IntervalValue } = {
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

    private intervalDropdown: Dropdown<IntervalValue>

    private canvas: HTMLCanvasElement

    private chart: Chart

    private _statistics: Statistics | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.intervalDropdown = document.createElement('bookshelf-ui-dropdown')
        this.intervalDropdown.options = [
            {
                value: this.intervals.year,
                label: 'Year',
            },
            {
                value: this.intervals.month,
                label: 'Month',
            },
            {
                value: this.intervals.week,
                label: 'Week',
            },
            {
                value: this.intervals.day,
                label: 'Day',
            },
        ]
        this.intervalDropdown.value = this.intervals.month
        this.intervalDropdown.onChange = () => this.update()
        this.canvas = document.createElement('canvas')
        this.root.appendChild(this.intervalDropdown)
        this.root.appendChild(this.canvas)
    }

    public connectedCallback() {
        if (this.chart) {
            this.chart.destroy()
        }

        this.chart = new Chart(this.canvas, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: '# of pages',
                        data: this.pages(),
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        type: 'timeseries',
                        time: {
                            unit: 'day',
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        })
    }

    private update(): void {
        if (!this.chart) {
            return
        }

        this.chart.options!.scales!.x = {
            type: 'timeseries',
            time: {
                unit: this.intervalDropdown.value.chart,
            },
        }
        this.chart.data.datasets[0].data = this.pages()
        this.chart.update()
    }

    private pages(): Array<{ x: number; y: number }> {
        const result: Array<{ x: number; y: number }> = []

        if (this._statistics === null) {
            return result
        }

        for (const [date, count] of this._statistics.pagesRead(this.intervalDropdown.value.statistics).entries()) {
            result.push({ x: date.getTime(), y: count })
        }

        return result
    }

    set statistics(value: Statistics) {
        this._statistics = value
        this.update()
    }
}

const TAG_NAME = 'bookshelf-statistics-pages-read-chart'

customElements.define(TAG_NAME, PagesReadChart)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PagesReadChart
    }
}
