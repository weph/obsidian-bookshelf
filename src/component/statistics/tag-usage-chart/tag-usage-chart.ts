import Chart from 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-statistics-tag-usage-chart'

@customElement(TAG_NAME)
export class TagUsageChart extends LitElement {
    static styles = css`
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
    `

    @query('canvas')
    private canvas: HTMLCanvasElement

    private chart: Chart | null = null

    @property()
    public statistics: Statistics | null = null

    protected render() {
        return html` <div id="container">
            <canvas></canvas>
        </div>`
    }

    protected firstUpdated() {
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

    protected updated() {
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

        if (this.statistics === null) {
            return [counts, labels]
        }

        Array.from(this.statistics.tagUsage().entries())
            .sort((a, b) => (a[1] > b[1] ? -1 : 1))
            .slice(0, 20)
            .forEach((i) => {
                counts.push(i[1])
                labels.push(i[0])
            })

        return [counts, labels]
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: TagUsageChart
    }
}
