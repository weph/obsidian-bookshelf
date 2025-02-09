import { ReadingProgressBarChart } from '../reading-progress-bar-chart/reading-progress-bar-chart'
import { ReadingProgress } from '../../reading-progress'

export interface StatisticsProps {
    readingProgress: Array<ReadingProgress>
}

export class Statistics extends HTMLElement implements StatisticsProps {
    private root: ShadowRoot

    private readingProgressChart: ReadingProgressBarChart

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `<bookshelf-reading-progress-bar-chart></bookshelf-reading-progress-bar-chart>`

        this.readingProgressChart = this.root.querySelector(
            'bookshelf-reading-progress-bar-chart',
        ) as ReadingProgressBarChart
    }

    set readingProgress(value: Array<ReadingProgress>) {
        customElements.whenDefined('bookshelf-reading-progress-bar-chart').then(() => {
            this.readingProgressChart.readingProgress = value
        })
    }
}

const TAG_NAME = 'bookshelf-statistics'

customElements.define(TAG_NAME, Statistics)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Statistics
    }
}
