import { PagesReadChart } from './pages-read-chart/pages-read-chart'
import { Statistics as StatisticsData } from '../../statistics'
import './pages-read-chart/pages-read-chart'

export interface StatisticsProps {
    statistics: StatisticsData
}

export class Statistics extends HTMLElement implements StatisticsProps {
    private root: ShadowRoot

    private pagesReadChart: PagesReadChart

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `<bookshelf-statistics-pages-read-chart></bookshelf-statistics-pages-read-chart>`

        this.pagesReadChart = this.root.querySelector('bookshelf-statistics-pages-read-chart')!
    }

    set statistics(value: StatisticsData) {
        customElements.whenDefined('bookshelf-statistics-pages-read-chart').then(() => {
            this.pagesReadChart.statistics = value
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
