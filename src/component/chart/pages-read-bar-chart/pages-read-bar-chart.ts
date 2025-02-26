import Chart, { TimeUnit } from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-pages-read-bar-chart'

@customElement(TAG_NAME)
export class PagesReadBarChart extends LitElement {
    static styles = css`
        canvas {
            position: relative;
        }
    `

    @query('canvas')
    private canvas: HTMLCanvasElement

    private chart: Chart | null = null

    @property()
    public data: Array<{ x: number; y: number }> = []

    @property()
    public xAxisUnit: TimeUnit = 'day'

    protected render() {
        return html` <canvas></canvas>`
    }

    protected firstUpdated() {
        this.chart = new Chart(this.canvas, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: '# of pages',
                        data: this.data,
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
                            unit: this.xAxisUnit,
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        })
    }

    protected updated() {
        if (!this.chart) {
            return
        }

        this.chart.options!.scales!.x = {
            type: 'timeseries',
            time: {
                unit: this.xAxisUnit,
            },
        }
        this.chart.data.datasets[0].data = this.data

        this.chart.update()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PagesReadBarChart
    }
}
