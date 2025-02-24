import Chart from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'

export interface TagUsageChartProps {
    statistics: Statistics
}

export class TagUsageChart extends HTMLElement implements TagUsageChartProps {
    private root: ShadowRoot

    private canvas: HTMLCanvasElement

    private chart: Chart

    private _statistics: Statistics | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <div id="container"><canvas></canvas></div>
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                }
                
                #container {
                    width: 100%;
                    max-width: 540px;
                    aspect-ratio: 1/1;                
                }
                
                canvas {
                    position: relative;
                }
            </style>
        `

        this.canvas = this.root.querySelector('canvas')! //document.createElement('canvas')
    }

    public connectedCallback() {
        if (this.chart) {
            this.chart.destroy()
        }

        this.chart = new Chart(this.canvas, {
            type: 'pie',
            data: {
                datasets: [
                    {
                        data: [],
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
            },
        })
    }

    private update(): void {
        if (!this.chart) {
            return
        }

        const data = this.data()

        this.chart.data.datasets = [
            {
                data: data[0],
            },
        ]
        this.chart.data.labels = data[1]
        this.chart.update()
    }

    private data(): [Array<number>, Array<string>] {
        const counts: Array<number> = []
        const labels: Array<string> = []

        if (this._statistics === null) {
            return [counts, labels]
        }

        Array.from(this._statistics.tagUsage().entries())
            .sort((a, b) => (a[1] > b[1] ? -1 : 1))
            .slice(0, 20)
            .forEach((i) => {
                counts.push(i[1])
                labels.push(i[0])
            })

        return [counts, labels]
    }

    set statistics(value: Statistics) {
        this._statistics = value
        this.update()
    }
}

const TAG_NAME = 'bookshelf-statistics-tag-usage-chart'

customElements.define(TAG_NAME, TagUsageChart)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: TagUsageChart
    }
}
