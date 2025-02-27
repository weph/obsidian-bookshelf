import { TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import '../../chart/pages-read-bar-chart/pages-read-bar-chart'
import { Interval, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-statistics-pages-read-chart'

interface IntervalValue {
    chart: TimeUnit
    statistics: Interval
}

@customElement(TAG_NAME)
export class PagesReadChart extends LitElement {
    static styles = css`
        #chart-container {
            width: 100%;
            aspect-ratio: 2/1;
        }
    `

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

    @state()
    private interval = this.intervals.year

    @property()
    public statistics: Statistics | null = null

    protected render() {
        const intervalOptions = [
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

        return html`
            <bookshelf-ui-dropdown
                .value=${this.interval}
                .options=${intervalOptions}
                .onChange=${(value: (typeof this.intervals)[0]) => (this.interval = value)}
            ></bookshelf-ui-dropdown>
            <div id="chart-container">
                <bookshelf-pages-read-bar-chart
                    x-axis-unit="${this.interval.chart}"
                    .data=${this.data()}
                ></bookshelf-pages-read-bar-chart>
            </div>
        `
    }

    private data() {
        if (this.statistics === null) {
            return []
        }

        return Array.from(this.statistics.pagesRead(this.interval.statistics).entries()).map((entry) => ({
            x: entry[0].getTime(),
            y: entry[1],
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PagesReadChart
    }
}
