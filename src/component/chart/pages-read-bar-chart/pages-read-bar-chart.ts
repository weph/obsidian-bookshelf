import Chart, { TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'

export interface PagesReadBarChartProps {
    data: Map<Date, number>
    xAxisUnit: TimeUnit
}

export class PagesReadBarChart extends HTMLElement implements PagesReadBarChartProps {
    private root: ShadowRoot

    private readonly canvas: HTMLCanvasElement

    private chart: Chart

    private _data: Array<{ x: number; y: number }> = []

    private _xAxisUnit: TimeUnit = 'day'

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.canvas = document.createElement('canvas')
        this.canvas.style.position = 'relative'
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
                        data: this._data,
                    },
                ],
            },
            options: {
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
                            unit: this._xAxisUnit,
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        })
    }

    set xAxisUnit(value: TimeUnit) {
        this._xAxisUnit = value

        if (!this.chart) {
            return
        }

        this.chart.options!.scales!.x = {
            type: 'timeseries',
            time: {
                unit: this._xAxisUnit,
            },
        }

        this.chart.update()
    }

    set data(value: Map<Date, number>) {
        this._data = []

        for (const [date, count] of value.entries()) {
            this._data.push({ x: date.getTime(), y: count })
        }

        if (!this.chart) {
            return
        }

        this.chart.data.datasets[0].data = this._data

        this.chart.update()
    }
}

const TAG_NAME = 'bookshelf-pages-read-bar-chart'

customElements.define(TAG_NAME, PagesReadBarChart)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PagesReadBarChart
    }
}
