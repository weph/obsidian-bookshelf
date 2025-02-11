import Chart from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Interval, Statistics } from '../../../statistics'

export interface ReadingProgressBarChartProps {
    statistics: Statistics
}

export class PagesReadChart extends HTMLElement implements ReadingProgressBarChartProps {
    private root: ShadowRoot

    private canvas: HTMLCanvasElement

    private chart: Chart

    private _statistics: Statistics | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.canvas = document.createElement('canvas')
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

        this.chart.data.datasets[0].data = this.pages()
        this.chart.update()
    }

    private pages(): Array<{ x: number; y: number }> {
        const result: Array<{ x: number; y: number }> = []

        if (this._statistics === null) {
            return result
        }

        for (const [date, count] of this._statistics.pagesRead(Interval.Month).entries()) {
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
