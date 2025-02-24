import { TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import '../../chart/pages-read-bar-chart/pages-read-bar-chart'
import { Interval, Statistics } from '../../../reading-journey/statistics/statistics'
import { Dropdown } from '../../dropdown/dropdown'
import { PagesReadBarChart } from '../../chart/pages-read-bar-chart/pages-read-bar-chart'

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

    private chart: PagesReadBarChart

    private _statistics: Statistics | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <bookshelf-ui-dropdown></bookshelf-ui-dropdown>
            <div id="chart-container">
                <bookshelf-pages-read-bar-chart></bookshelf-pages-read-bar-chart>
            </div>
            <style>
                #chart-container {
                    width: 100%;
                    aspect-ratio: 2/1;
                }
            </style>
        `

        this.intervalDropdown = this.root.querySelector('bookshelf-ui-dropdown')!
        this.intervalDropdown.value = this.intervals.month
        this.intervalDropdown.onChange = () => this.update()
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

        this.chart = this.root.querySelector('bookshelf-pages-read-bar-chart')!
    }

    private update(): void {
        if (this._statistics === null) {
            return
        }

        this.chart.xAxisUnit = this.intervalDropdown.value.chart
        this.chart.data = this._statistics.pagesRead(this.intervalDropdown.value.statistics)
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
