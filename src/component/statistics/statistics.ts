import { PagesReadChart } from './pages-read-chart/pages-read-chart'
import './pages-read-chart/pages-read-chart'
import { Dropdown } from '../dropdown/dropdown'
import { Bookshelf } from '../../bookshelf'
import { Gallery } from '../gallery/gallery'

export interface StatisticsProps {
    bookshelf: Bookshelf
}

export class Statistics extends HTMLElement implements StatisticsProps {
    private root: ShadowRoot

    private yearsDropdown: Dropdown<number | null>

    private pagesReadChart: PagesReadChart

    private gallery: Gallery

    private _bookshelf: Bookshelf

    private _year: number | null = null

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <bookshelf-ui-dropdown></bookshelf-ui-dropdown>
            <div class="container">
                <h2>Books</h2>
                <div id="book-counts" class="counts"></div>            
            </div>
            <div class="container">
                <h2>Pages</h2>
                <div id="page-counts" class="counts"></div>
                <bookshelf-statistics-pages-read-chart></bookshelf-statistics-pages-read-chart>
            </div>
            <div class="container">
                <h2>Books</h2>
                <bookshelf-gallery></bookshelf-gallery>
            </div>
            <style>
                .container {
                    max-width: 1080px;
                    margin: 0 auto 4rem auto;
                    padding: 0 2rem;
                }
                
                h2 {
                    text-align: center;
                }
                
                .counts {
                    display: flex;
                    justify-content: center;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: baseline;
                    gap: 5rem;
                }
                
                .counts div {
                    text-align: center;
                }
                
                .counts .number {
                    font-size: 3rem;
                }
            </style>
        `

        this.yearsDropdown = this.root.querySelector('bookshelf-ui-dropdown')!
        this.pagesReadChart = this.root.querySelector('bookshelf-statistics-pages-read-chart')!
        this.gallery = this.root.querySelector('bookshelf-gallery')!

        this.yearsDropdown.onChange = (value) => (this.year = value)
    }

    private update(): void {
        const statistics = this._bookshelf.statistics(this._year)

        const actions = statistics.actions()
        this.root.querySelector('#book-counts')!.innerHTML = `
            <div>
                <div class="number">${actions.started}</div>
                started
            </div>
            <div>
                <div class="number">${actions.finished}</div>
                finished
            </div>
            <div>
                <div class="number">${actions.abandoned}</div>
                abandoned
            </div>
        `

        this.root.querySelector('#page-counts')!.innerHTML = `
            <div>
                <div class="number">${statistics.totalNumberOfPages().toLocaleString()}</div>
                total
            </div>
        `

        this.gallery.books = statistics.books()

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
