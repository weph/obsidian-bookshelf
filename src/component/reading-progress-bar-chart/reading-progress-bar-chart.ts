import { ReadingJourneyItem } from '../../reading-journey'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-luxon'

export interface ReadingProgressBarChartProps {
    readingJourney: Array<ReadingJourneyItem>
}

export class ReadingProgressBarChart extends HTMLElement implements ReadingProgressBarChartProps {
    private root: ShadowRoot

    private canvas: HTMLCanvasElement

    private chart: Chart

    private _readingProgress: Array<ReadingJourneyItem> = []

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.canvas = document.createElement('canvas')
        this.root.appendChild(this.canvas)
    }

    public connectedCallback() {
        this.chart = new Chart(this.canvas, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: '# of Pages',
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
        return this._readingProgress
            .filter((item) => item.action === 'progress')
            .map((item) => ({ x: item.date.getTime(), y: item.pages }))
    }

    set readingJourney(readingProgress: Array<ReadingJourneyItem>) {
        this._readingProgress = readingProgress
        this.update()
    }
}

const TAG_NAME = 'bookshelf-reading-progress-bar-chart'

customElements.define(TAG_NAME, ReadingProgressBarChart)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: ReadingProgressBarChart
    }
}
