import { PagesReadChart } from './pages-read-chart/pages-read-chart'
import './pages-read-chart/pages-read-chart'
import { Dropdown } from '../dropdown/dropdown'
import { Bookshelf } from '../../bookshelf'

export interface StatisticsProps {
    bookshelf: Bookshelf
}

export class Statistics extends HTMLElement implements StatisticsProps {
    private root: ShadowRoot

    private yearsDropdown: Dropdown<number | null>

    private pagesReadChart: PagesReadChart

    private _bookshelf: Bookshelf

    private _year: number | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <bookshelf-ui-dropdown></bookshelf-ui-dropdown>
            <bookshelf-statistics-pages-read-chart></bookshelf-statistics-pages-read-chart>
        `

        this.yearsDropdown = this.root.querySelector('bookshelf-ui-dropdown')!
        this.pagesReadChart = this.root.querySelector('bookshelf-statistics-pages-read-chart')!

        this.yearsDropdown.onChange = (value) => (this.year = value)
    }

    private update(): void {
        const statistics = this._bookshelf.statistics(this._year)

        customElements.whenDefined('bookshelf-statistics-pages-read-chart').then(() => {
            this.pagesReadChart.statistics = statistics
        })
    }

    set year(value: number | null) {
        this._year = value
        this.update()
    }

    set bookshelf(value: Bookshelf) {
        this._bookshelf = value

        this.yearsDropdown.options = [
            { value: null, label: 'All' },
            ...this._bookshelf
                .statistics()
                .years()
                .reverse()
                .map((y) => ({ value: y, label: y.toString() })),
        ]

        this.update()
    }
}

const TAG_NAME = 'bookshelf-statistics'

customElements.define(TAG_NAME, Statistics)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Statistics
    }
}
